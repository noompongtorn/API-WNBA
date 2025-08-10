const axios = require("axios");
const { pool } = require("../db");
const {
  recordByUserId,
  recordByFetchData,
  internalCreateRecord,
  conditionList,
} = require("./records-service");
const { getTotalPrice, getDataByMappingArray } = require("../utils/totalArray");
const { convertNewToOld } = require("../../../convertNewToOld");
// const { convertWNBANewToOld } = require('../../../convertWNBANewToOld');
const { convertPlayerNewToOld } = require("../../../convertPlayerNewToOld");
const {
  convertWNBANewToOld,
  convertPlayerNewToOldWNBA,
} = require("../../../convertWNBANewToOld");

const API_KEY = "9e488e405fcc49a38c09b5944bad49c5";
const BASE_URL = "https://api.sportsdata.io/v3/nba/scores/json";

const queryDatabase = async (query, params) => {
  try {
    const result = await pool.query(query, params);
    return result;
  } catch (error) {
    console.error("Database query error:", error.message);
    throw error;
  }
};

const fetchAndInsertData = async (type, name, endpoint) => {
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      headers: { "Ocp-Apim-Subscription-Key": API_KEY },
    });
    const jsonResponse = JSON.stringify(response.data);

    // Insert into database
    const insertQuery = `
            INSERT INTO nba (type, json_response) 
            VALUES ($1, $2) RETURNING id, type
        `;
    await queryDatabase(insertQuery, [name, `{ "result": ${jsonResponse} }`]);
    console.log(`Inserted ${type}: success`);
  } catch (error) {
    console.error(
      `Error fetching and inserting ${type}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

const fetchAndInsertDataNew = async (type, name, date, preDate) => {
  try {
    const response = await axios.get(
      `https://v2.nba.api-sports.io/games?date=` + date,
      {
        headers: {
          "x-rapidapi-host": "v2.nba.api-sports.io",
          "x-rapidapi-key": "5f800af6bb86e88a6521d4e9071bb559",
        },
      }
    );
    const jsonResponse = convertNewToOld(response.data.response ?? []) ?? [];

    const response2 = await axios.get(
      `https://v2.nba.api-sports.io/games?date=` + preDate,
      {
        headers: {
          "x-rapidapi-host": "v2.nba.api-sports.io",
          "x-rapidapi-key": "5f800af6bb86e88a6521d4e9071bb559",
        },
      }
    );
    const jsonResponse2 = convertNewToOld(response2.data.response ?? []) ?? [];

    // Insert into database
    const insertQuery = `
            INSERT INTO nba (type, json_response) 
            VALUES ($1, $2) RETURNING id, type
        `;

    const arrayDates = jsonResponse?.filter((item) => {
      const now = new Date(item.DateTimeUTC);
      const gmt7Date = new Date(now.getTime() + 7 * 60 * 60 * 1000);

      return new Date(gmt7Date).toISOString().split("T")[0] === date;
    });

    const arrayDates2 = jsonResponse2?.filter((item) => {
      const now = new Date(item.DateTimeUTC);
      const gmt7Date = new Date(now.getTime() + 7 * 60 * 60 * 1000);

      return new Date(gmt7Date).toISOString().split("T")[0] === date;
    });

    await queryDatabase(insertQuery, [
      name,
      `{ "result": ${JSON.stringify([...arrayDates, ...arrayDates2])} }`,
    ]);

    console.log(`Inserted ${type}: success`);
  } catch (error) {
    console.error(
      `Error fetching and inserting ${type}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

const fetchAndInsertDataNewWNBA = async (type, name, date, preDate) => {
  try {
    const currentYear = date.split("-")[0];
    const currentMonth = date.split("-")[1];
    const currentDay = date.split("-")[2];

    const prevYear = preDate.split("-")[0];
    const prevMonth = preDate.split("-")[1];
    const prevDay = preDate.split("-")[2];

    console.log(`year=${currentYear}&month=${currentMonth}&day=${currentDay}`);
    console.log(`year=${prevYear}&month=${prevMonth}&day=${prevDay}`);

    const response = await axios.get(
      `https://wnba-api.p.rapidapi.com/wnbaschedule?year=${currentYear}&month=${currentMonth}&day=${currentDay}`,
      {
        headers: {
          "x-rapidapi-host": "wnba-api.p.rapidapi.com",
          "x-rapidapi-key":
            "747d289c28msh61f982f0ddeecb0p111557jsn969161302067",
        },
      }
    );
    const currentGames = await Promise.all(
      response.data[date.replace(/-/g, "")].map(async (item) => {
        const gameDetail = await axios.get(
          `https://wnba-api.p.rapidapi.com/wnbaplay?gameId=${item.id}`,
          {
            headers: {
              "x-rapidapi-host": "wnba-api.p.rapidapi.com",
              "x-rapidapi-key":
                "747d289c28msh61f982f0ddeecb0p111557jsn969161302067",
            },
          }
        );

        return { ...item, gameDetail: gameDetail.data };
      })
    );

    const jsonResponse = convertWNBANewToOld(currentGames ?? []) ?? [];

    const response2 = await axios.get(
      `https://wnba-api.p.rapidapi.com/wnbaschedule?year=${prevYear}&month=${prevMonth}&day=${prevDay}`,
      {
        headers: {
          "x-rapidapi-host": "wnba-api.p.rapidapi.com",
          "x-rapidapi-key":
            "747d289c28msh61f982f0ddeecb0p111557jsn969161302067",
        },
      }
    );

    const prevGames = await Promise.all(
      response2.data[preDate.replace(/-/g, "")].map(async (item) => {
        const gameDetail = await axios.get(
          `https://wnba-api.p.rapidapi.com/wnbaplay?gameId=${item.id}`,
          {
            headers: {
              "x-rapidapi-host": "wnba-api.p.rapidapi.com",
              "x-rapidapi-key":
                "747d289c28msh61f982f0ddeecb0p111557jsn969161302067",
            },
          }
        );

        return { ...item, gameDetail: gameDetail.data };
      })
    );

    const jsonResponse2 = convertWNBANewToOld(prevGames ?? []) ?? [];

    // Insert into database
    const insertQuery = `
            INSERT INTO nba (type, json_response) 
            VALUES ($1, $2) RETURNING id, type
        `;

    console.log("====================================");
    console.log("currentGames : ", currentGames);
    console.log("prevGames : ", prevGames);

    console.log("jsonResponse : ", jsonResponse);
    console.log("jsonResponse2 : ", jsonResponse2);
    console.log("====================================");

    const arrayDates = jsonResponse ?? [];

    const arrayDates2 = jsonResponse2 ?? [];

    await queryDatabase(insertQuery, [
      name,
      `{ "result": ${JSON.stringify([...arrayDates, ...arrayDates2])} }`,
    ]);

    console.log(`Inserted ${type}: success`);
  } catch (error) {
    console.error(
      `Error fetching and inserting ${type}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

const fetchAndInsertDataNew2 = async (type, name, date) => {
  try {
    const response = await axios.get(`https://v2.nba.api-sports.io/teams`, {
      headers: {
        "x-rapidapi-host": "v2.nba.api-sports.io",
        "x-rapidapi-key": "5f800af6bb86e88a6521d4e9071bb559",
      },
    });
    const jsonResponse = JSON.stringify(
      convertPlayerNewToOld(response.data.response)
    );

    // Insert into database
    const insertQuery = `
            INSERT INTO nba (type, json_response) 
            VALUES ($1, $2) RETURNING id, type
        `;
    await queryDatabase(insertQuery, [name, `{ "result": ${jsonResponse} }`]);
    console.log(`Inserted ${type}: success`);
  } catch (error) {
    console.error(
      `Error fetching and inserting ${type}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

const fetchAndInsertDataWNBANew2 = async (type, name, date) => {
  try {
    const response = await axios.get(
      `https://wnba-api.p.rapidapi.com/wnbateamlist?limit=1000`,
      {
        headers: {
          "x-rapidapi-host": "wnba-api.p.rapidapi.com",
          "x-rapidapi-key":
            "747d289c28msh61f982f0ddeecb0p111557jsn969161302067",
        },
      }
    );
    const jsonResponse = JSON.stringify(
      convertPlayerNewToOldWNBA(response.data.sports[0].leagues[0].teams)
    );

    // Insert into database
    const insertQuery = `
            INSERT INTO nba (type, json_response) 
            VALUES ($1, $2) RETURNING id, type
        `;
    await queryDatabase(insertQuery, [name, `{ "result": ${jsonResponse} }`]);
    console.log(`Inserted ${type}: success`);
  } catch (error) {
    console.error(
      `Error fetching and inserting ${type}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

const fetchNBAData = async () => {
  const now = new Date();
  // const gmt7Offset = -7 * 60;
  // const gmt7Offset = 0;
  // const gmt7Date = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + gmt7Offset * 60000);
  const gmt7Date = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  // gmt7Date.setDate(gmt7Date.getDate()); // test

  const today = gmt7Date.toISOString().split("T")[0];
  const yesterday = new Date(gmt7Date);
  const tomorrow = new Date(gmt7Date);
  tomorrow.setDate(tomorrow.getDate() + 1); // sit
  yesterday.setDate(yesterday.getDate() - 1);

  const formattedDate = tomorrow.toISOString().split("T")[0];
  const formattedPrevDate = yesterday.toISOString().split("T")[0];

  const wnbanow = new Date();
  // const gmt7Offset = -7 * 60;
  // const gmt7Offset = 0;
  // const gmt7Date = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + gmt7Offset * 60000);
  const wnbagmt7Date = new Date(wnbanow.getTime() + 7 * 60 * 60 * 1000);
  // gmt7Date.setDate(gmt7Date.getDate()); // test

  wnbagmt7Date.setDate(wnbanow.getDate() - 1); // sit

  const wnbatoday = wnbagmt7Date.toISOString().split("T")[0];
  const wnbayesterday = new Date(wnbagmt7Date);
  const wnbatomorrow = new Date(wnbagmt7Date);

  wnbatomorrow.setDate(wnbatomorrow.getDate() + 1); // sit
  wnbayesterday.setDate(wnbayesterday.getDate() - 1);

  const wnbaformattedDate = wnbatomorrow.toISOString().split("T")[0];
  const wnbaformattedPrevDate = wnbayesterday.toISOString().split("T")[0];

  // await fetchAndInsertDataNew2('players', 'players', 'AllTeams');
  // await fetchAndInsertDataNew('games', 'currentGames', `${today}`, `${formattedPrevDate}`);
  // await fetchAndInsertDataNew('games', 'nextGames', `${formattedDate}`, `${today}`);
  await fetchAndInsertDataWNBANew2("players", "wnbaPlayers", "AllTeams");
  await fetchAndInsertDataNewWNBA(
    "games",
    "wnbaCurrentGames",
    `${wnbatoday}`,
    `${wnbaformattedPrevDate}`
  );
  await fetchAndInsertDataNewWNBA(
    "games",
    "wnbaNextGames",
    `${wnbaformattedDate}`,
    `${wnbatoday}`
  );
};

const fetchCurrentGameData = async () => {
  const now = new Date();
  const gmt7Offset = 0 * 60;
  const gmt7Date = new Date(
    now.getTime() + now.getTimezoneOffset() * 60000 + gmt7Offset * 60000
  );

  gmt7Date.setDate(gmt7Date.getDate()); // test
  const yesterday = new Date(gmt7Date);
  const tomorrow = new Date(gmt7Date);
  tomorrow.setDate(tomorrow.getDate() + 1); // sit
  yesterday.setDate(yesterday.getDate() - 1);

  const today = gmt7Date.toISOString().split("T")[0];
  const formattedPrevDate = yesterday.toISOString().split("T")[0];

  // await fetchAndInsertDataNew('games', 'currentGames', `${today}`, `${formattedPrevDate}`);

  const wnbanow = new Date();
  // const gmt7Offset = -7 * 60;
  // const gmt7Offset = 0;
  // const gmt7Date = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + gmt7Offset * 60000);
  const wnbagmt7Date = new Date(wnbanow.getTime() + 7 * 60 * 60 * 1000);
  // gmt7Date.setDate(gmt7Date.getDate()); // test

  wnbagmt7Date.setDate(wnbanow.getDate() - 1); // sit

  const wnbatoday = wnbagmt7Date.toISOString().split("T")[0];
  const wnbayesterday = new Date(wnbagmt7Date);
  const wnbatomorrow = new Date(wnbagmt7Date);

  wnbatomorrow.setDate(wnbatomorrow.getDate() + 1); // sit
  wnbayesterday.setDate(wnbayesterday.getDate() - 1);

  const wnbaformattedDate = wnbatomorrow.toISOString().split("T")[0];
  const wnbaformattedPrevDate = wnbayesterday.toISOString().split("T")[0];

  await fetchAndInsertDataNewWNBA(
    "games",
    "wnbaCurrentGames",
    `${wnbatoday}`,
    `${wnbaformattedPrevDate}`
  );

  const currentGameQuery =
    "SELECT json_response FROM nba WHERE type = 'currentGames' ORDER BY created_at DESC LIMIT 1";
  const currentWNBAGameQuery =
    "SELECT json_response FROM nba WHERE type = 'wnbaCurrentGames' ORDER BY created_at DESC LIMIT 1";

  const [currentGame, currentWNBAGame] = await Promise.all([
    queryDatabase(currentGameQuery, []),
    queryDatabase(currentWNBAGameQuery, []),
  ]);

  const games = [
    // ...currentGame.rows[0]?.json_response?.result ?? [],
    ...(currentWNBAGame.rows[0]?.json_response?.result ?? []),
  ];

  const rawRecords = await recordByFetchData();
  const records = rawRecords.rows;

  await Promise.all(
    records.map(async (record) => {
      const gameId = record.record_data.id;
      const game = games.find((game) => game.GameID === gameId);

      if (!game) {
        console.log("====================================");
        console.log("invalid game", gameId);
        console.log("====================================");

        return;
      }

      if (!game.Quarters) {
        console.log("====================================");
        console.log("invalid quarter", gameId);
        console.log("====================================");

        return;
      }

      if (game.Quarters.length === 0) {
        console.log("====================================");
        console.log("empty quarter");
        console.log("====================================");

        return;
      }

      if (game.Quarters[0] === 0) {
        console.log("====================================");
        console.log("empty quarter");
        console.log("====================================");

        return;
      }

      const rounds = Array.from({ length: 6 }).map((item, index) => ({
        isWin: checkWinner(record.random.random, game.Quarters, index),
        isTemplate: false,
        name: `${record.random.random[index]}`,
      }));

      await internalCreateRecord(record.id, {
        ...record.record_data,
        Quarters: game.Quarters,
        rounds,
      });
    })
  );
};

const checkWinner = (answer, quarters, index) => {
  const rawQuarters = Array.from({ length: 6 })
    .map((_, index) => {
      if (index === 4) {
        return {
          Name: "Q1+Q2",
          GameID: quarters[0].GameID,
          Number: 3,
          AwayScore: quarters[0]?.AwayScore + quarters[1]?.AwayScore,
          HomeScore: quarters[0]?.HomeScore + quarters[1]?.HomeScore,
        };
      }

      if (index === 5) {
        return {
          Name: "Q3+Q4",
          GameID: quarters[0].GameID,
          Number: 6,
          AwayScore:
            quarters[0]?.AwayScore +
            quarters[1]?.AwayScore +
            quarters[2]?.AwayScore +
            quarters[3]?.AwayScore +
            (quarters[4]?.AwayScore || 0),
          HomeScore:
            quarters[0]?.HomeScore +
            quarters[1]?.HomeScore +
            quarters[2]?.HomeScore +
            quarters[3]?.HomeScore +
            (quarters[4]?.HomeScore || 0),
        };
      }

      if (index === 2 || index === 3) {
        return { ...quarters[index], Number: index === 2 ? 4 : 5 };
      }

      return quarters[index];
    })
    .sort((first, second) => {
      return first.Number - second.Number;
    });

  const answerInfo = answer[index];

  const quarter = rawQuarters.find((quarter) => quarter.Number === index + 1);

  const checkScore =
    (quarter.HomeScore + quarter.AwayScore) % 2 === 0 ? "2" : "1";
  return answerInfo === checkScore;
};

const getWNBAPageData = async (uid) => {
  const playersQuery =
    "SELECT json_response FROM nba WHERE type = 'wnbaPlayers' ORDER BY created_at DESC LIMIT 1";
  const currentGameQuery =
    "SELECT json_response FROM nba WHERE type = 'wnbaCurrentGames' ORDER BY created_at DESC LIMIT 1";
  const nextGameQuery =
    "SELECT json_response FROM nba WHERE type = 'wnbaNextGames' ORDER BY created_at DESC LIMIT 1";

  const [players, currentGame, nextGame] = await Promise.all([
    queryDatabase(playersQuery, []),
    queryDatabase(currentGameQuery, []),
    queryDatabase(nextGameQuery, []),
  ]);

  const record = await recordByUserId(uid);

  return {
    record: record.rows
      .sort(
        (a, b) =>
          new Date(b.record_data.DateTimeUTC).valueOf() -
          new Date(a.record_data.DateTimeUTC).valueOf()
      )
      .map((item, index) => ({ ...item, show: index < 20 }))
      ?.filter((item) => item.show),
    players: players.rows.length > 0 ? players.rows[0]?.json_response : null,
    currentGame:
      currentGame.rows.length > 0 ? currentGame.rows[0]?.json_response : null,
    nextGame: nextGame.rows.length > 0 ? nextGame.rows[0]?.json_response : null,
  };
};

const getHomePageData = async (uid) => {
  const playersQuery =
    "SELECT json_response FROM nba WHERE type = 'wnbaPlayers' ORDER BY created_at DESC LIMIT 1";
  const currentGameQuery =
    "SELECT json_response FROM nba WHERE type = 'wnbaCurrentGames' ORDER BY created_at DESC LIMIT 1";
  const nextGameQuery =
    "SELECT json_response FROM nba WHERE type = 'wnbaNextGames' ORDER BY created_at DESC LIMIT 1";

  const [players, currentGame, nextGame] = await Promise.all([
    queryDatabase(playersQuery, []),
    queryDatabase(currentGameQuery, []),
    queryDatabase(nextGameQuery, []),
  ]);

  const record = await recordByUserId(uid);

  return {
    record: record.rows
      .sort(
        (a, b) =>
          new Date(b.record_data.DateTimeUTC).valueOf() -
          new Date(a.record_data.DateTimeUTC).valueOf()
      )
      .map((item, index) => ({ ...item, show: index < 20 }))
      ?.filter((item) => item.show),
    players: players.rows.length > 0 ? players.rows[0]?.json_response : null,
    currentGame:
      currentGame.rows.length > 0 ? currentGame.rows[0]?.json_response : null,
    nextGame: nextGame.rows.length > 0 ? nextGame.rows[0]?.json_response : null,
  };
};

const getHistoryPageData = async (uid, teamId) => {
  const record = await recordByUserId(uid);

  return {
    record: record.rows?.filter((item) => item.record_data.thisGame === teamId),
  };
};

// ✅ Refactor: ลดซ้ำ, กัน null, รวม helper, log เป็นหมวดหมู่
const getTotalData = async (uid, teamId) => {
  try {
    const [record, rawCondition] = await Promise.all([
      recordByUserId(uid),
      conditionList(),
    ]);

    const conditions = rawCondition?.rows?.[0]?.json_response?.results ?? [];

    // ---------- Helpers ----------
    const ts = (d) => new Date(d).valueOf();

    const byTeamSorted = (rows) =>
      (rows ?? [])
        .filter((it) => it?.record_data?.thisGame === teamId)
        .sort(
          (a, b) =>
            ts(a?.record_data?.DateTimeUTC) - ts(b?.record_data?.DateTimeUTC)
        )
        .map((it) => it?.record_data)
        .filter(Boolean);

    const isUsable = (r) =>
      !r?.rounds?.[0]?.isTemplate && !!(r?.Quarters?.[0]?.AwayScore || 0);

    const isNextUsable = (r) =>
      r?.rounds?.[0]?.isTemplate || !(r?.Quarters?.[0]?.AwayScore || 0);

    const roundsToBinary = (rec) =>
      (rec?.rounds ?? []).map((x) => (x?.isWin ? 1 : 0));

    const packTotal = (arr = []) => ({
      rounds: arr,
      totalPriceByRound: arr.reduce((acc, n) => acc + (Number(n) || 0), 0),
    });

    const buildQuartersCalculated = (item) =>
      (item?.rounds ?? [])
        .map((_, idx) => {
          const Q = item?.Quarters ?? [];
          if (idx === 2) return { ...(Q[idx] ?? {}), Name: "4", Number: 4 };
          if (idx === 3) return { ...(Q[idx] ?? {}), Name: "5", Number: 5 };
          if (idx === 4)
            return {
              AwayScore: (Q[0]?.AwayScore || 0) + (Q[1]?.AwayScore || 0),
              GameID: 14870,
              HomeScore: (Q[0]?.HomeScore || 0) + (Q[1]?.HomeScore || 0),
              Name: "3",
              Number: 3,
              QuarterID: 171148,
            };
          if (idx === 5)
            return {
              AwayScore:
                (Q[0]?.AwayScore || 0) +
                (Q[1]?.AwayScore || 0) +
                (Q[2]?.AwayScore || 0) +
                (Q[3]?.AwayScore || 0) +
                (Q[4]?.AwayScore || 0),
              GameID: 14870,
              HomeScore:
                (Q[0]?.HomeScore || 0) +
                (Q[1]?.HomeScore || 0) +
                (Q[2]?.HomeScore || 0) +
                (Q[3]?.HomeScore || 0) +
                (Q[4]?.HomeScore || 0),
              Name: "6",
              Number: 6,
              QuarterID: 171148,
            };
          return { ...(Q[idx] ?? {}) };
        })
        .sort((a, b) => (a?.Number ?? 0) - (b?.Number ?? 0));

    const buildQuartersNext = (item) =>
      (item?.rounds ?? [])
        .map((_, idx) => {
          const Q = item?.Quarters ?? [];
          const blank = { AwayScore: "", HomeScore: "" };
          if (idx === 2)
            return { ...(Q[idx] ?? {}), ...blank, Name: "4", Number: 4 };
          if (idx === 3)
            return { ...(Q[idx] ?? {}), ...blank, Name: "5", Number: 5 };
          if (idx === 4)
            return {
              ...blank,
              GameID: 14870,
              Name: "3",
              Number: 3,
              QuarterID: 171148,
            };
          if (idx === 5)
            return {
              ...blank,
              GameID: 14870,
              Name: "6",
              Number: 6,
              QuarterID: 171148,
            };
          return { ...(Q[idx] ?? {}), ...blank };
        })
        .sort((a, b) => (a?.Number ?? 0) - (b?.Number ?? 0));

    // ---------- Data pipeline ----------
    const all = byTeamSorted(record?.rows);
    const rawMainRecord = all.filter(isUsable);
    const rawNextMainRecord = all.filter(isNextUsable);

    const rawRecord = rawMainRecord.map(roundsToBinary).filter(Boolean);

    const records = getTotalPrice(
      getDataByMappingArray(rawRecord),
      conditions
    ).map(packTotal);

    const recordLasts = getTotalPrice(
      getDataByMappingArray([...rawRecord, [1, 1, 1, 1, 1, 1]]),
      conditions
    ).map(packTotal);

    const newRecords = rawMainRecord.map((item, index) => ({
      defeatTeamLogo: item?.defeatTeamLogo,
      currentTeamLogo: item?.currentTeamLogo,
      rounds: item?.rounds ?? [],
      currentTeam: item?.currentTeam,
      defeatTeam: item?.defeatTeam,
      DateTimeUTC: item?.DateTimeUTC,
      Quarters: buildQuartersCalculated(item),
      totals: records[index],
    }));

    const firstMock = conditions?.[0] ?? 0;

    const newNextRecords =
      rawNextMainRecord
        .map((item) => ({
          defeatTeamLogo: item?.defeatTeamLogo,
          currentTeamLogo: item?.currentTeamLogo,
          rounds: item?.rounds ?? [],
          currentTeam: item?.currentTeam,
          defeatTeam: item?.defeatTeam,
          DateTimeUTC: item?.DateTimeUTC,
          Quarters: buildQuartersNext(item),
          totals:
            (recordLasts?.[recordLasts.length - 1]?.rounds?.[0] ?? 0) === 0
              ? packTotal([
                  firstMock,
                  firstMock,
                  firstMock,
                  firstMock,
                  firstMock,
                  firstMock,
                ])
              : recordLasts?.[recordLasts.length - 1],
        }))
        .reverse()?.[0] ?? {};

    // ---------- Logging (แทนที่หลาย ๆ console.log เดิม) ----------
    const logSection = (title, data) => {
      console.log("====================================");
      console.log(`${title} : `, data);
      console.log("====================================");
    };

    logSection("rawMainRecord", rawMainRecord);
    logSection("rawNextMainRecord", rawNextMainRecord);
    logSection("rawRecord", rawRecord);
    logSection("records", records);
    logSection("recordLasts", recordLasts);
    logSection("newRecords", newRecords);
    logSection("firstMock", firstMock);
    logSection("newNextRecords", newNextRecords);

    console.log("===========");
    console.log(teamId);
    console.log(newRecords?.[0]?.rounds);
    console.log(newRecords?.[0]?.Quarters);
    console.log({
      rawRecord: newRecords,
      totals: records.reduce(
        (acc, curr) => acc + (curr?.totalPriceByRound || 0),
        0
      ),
      recordLasts: [{ ...newNextRecords }].filter((item) => item?.totals),
    });
    console.log("===========");

    // ---------- Return ----------
    const totalsSum = records.reduce(
      (acc, curr) => acc + (curr?.totalPriceByRound || 0),
      0
    );

    return {
      rawRecord: newRecords,
      totals: Number.isFinite(totalsSum) ? totalsSum : 0,
      recordLasts: [{ ...newNextRecords }].filter((item) => item?.totals),
    };
  } catch (error) {
    // สงวนโครงสร้างเดิมเมื่อผิดพลาด
    return {
      rawRecord: [],
      totals: 0,
    };
  }
};

function updateArrayBasedOnPrevious(array) {
  let totals = Array(array[0].length).fill(0);

  array.forEach((row, index) => {
    if (index === 0) {
      totals = [...row];

      return;
    }

    row.forEach((value, colIndex) => {
      if (array[index - 1][colIndex] === value && value === 1) {
        totals[colIndex]++;
      } else if (value === 1) {
        totals[colIndex] = 1;
      } else {
        totals[colIndex] = 0;
      }
    });
  });

  return totals;
}

module.exports = {
  fetchNBAData,
  getHomePageData,
  fetchCurrentGameData,
  getTotalData,
  getHistoryPageData,
  getWNBAPageData,
};
