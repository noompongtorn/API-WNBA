// type ConvertNewToOldParams = {
//   id: string
//   date: string
//   completed: boolean
//   teams: Team[]
//   gameDetail: GameDetail
// }

// type Team = {
//   id: string
//   name: string
// }

// export interface GameDetail {
//   teams: GameDetailTeam[]
//   id: string
//   plays: Play[]
//   competitions: Competition[]
//   season: Season
//   boxScore: BoxScore
//   seasonSeries: SeasonSery[]
//   standings: Standings
// }

// export interface GameDetailTeam {
//   uid: string
//   homeAway: string
//   score: string
//   winner: boolean
//   record: Record[]
//   possession: boolean
//   id: string
//   team: Team2
//   linescores: Linescore[]
//   order: number
// }

// export interface Record {
//   summary: string
//   displayValue: string
//   type: string
// }

// export interface Team2 {
//   uid: string
//   alternateColor: string
//   color: string
//   displayName: string
//   name: string
//   location: string
//   links: Link[]
//   id: string
//   abbreviation: string
//   logos: Logo[]
// }

// export interface Link {
//   rel: string[]
//   href: string
//   text: string
// }

// export interface Logo {
//   lastUpdated: string
//   width: number
//   alt: string
//   rel: string[]
//   href: string
//   height: number
// }

// export interface Linescore {
//   displayValue: string
// }

// export interface Play {
//   shootingPlay: boolean
//   sequenceNumber: string
//   period: Period
//   homeScore: number
//   coordinate: Coordinate
//   scoringPlay: boolean
//   clock: Clock
//   team?: Team3
//   type: Type
//   awayScore: number
//   wallclock: string
//   id: string
//   text: string
//   scoreValue: number
//   participants?: Participant[]
// }

// export interface Period {
//   displayValue: string
//   number: number
// }

// export interface Coordinate {
//   x: number
//   y: number
// }

// export interface Clock {
//   displayValue: string
// }

// export interface Team3 {
//   id: string
// }

// export interface Type {
//   id: string
//   text: string
// }

// export interface Participant {
//   athlete: Athlete
// }

// export interface Athlete {
//   id: string
// }

// export interface Competition {
//   date: string
//   commentaryAvailable: boolean
//   conferenceCompetition: boolean
//   liveAvailable: boolean
//   broadcasts: Broadcast[]
//   playByPlaySource: string
//   uid: string
//   competitors: Competitor[]
//   onWatchESPN: boolean
//   wallclockAvailable: boolean
//   boxscoreMinutes: boolean
//   series: Series[]
//   boxscoreAvailable: boolean
//   id: string
//   shotChartAvailable: boolean
//   timeoutsAvailable: boolean
//   neutralSite: boolean
//   recent: boolean
//   boxscoreSource: string
//   possessionArrowAvailable: boolean
//   status: Status
// }

// export interface Broadcast {
//   market: Market
//   media: Media
//   type: Type2
//   lang: string
//   region: string
//   isNational: boolean
// }

// export interface Market {
//   id: string
//   type: string
// }

// export interface Media {
//   shortName: string
// }

// export interface Type2 {
//   id: string
//   shortName: string
// }

// export interface Competitor {
//   uid: string
//   homeAway: string
//   score: string
//   winner: boolean
//   record: Record2[]
//   possession: boolean
//   id: string
//   team: Team4
//   linescores: Linescore2[]
//   order: number
// }

// export interface Record2 {
//   summary: string
//   displayValue: string
//   type: string
// }

// export interface Team4 {
//   uid: string
//   alternateColor: string
//   color: string
//   displayName: string
//   name: string
//   location: string
//   links: Link2[]
//   id: string
//   abbreviation: string
//   logos: Logo2[]
// }

// export interface Link2 {
//   rel: string[]
//   href: string
//   text: string
// }

// export interface Logo2 {
//   lastUpdated: string
//   width: number
//   alt: string
//   rel: string[]
//   href: string
//   height: number
// }

// export interface Linescore2 {
//   displayValue: string
// }

// export interface Series {
//   summary: string
//   competitors: Competitor2[]
//   totalCompetitions: number
//   description: string
//   completed: boolean
//   type: string
//   title: string
//   events: Event[]
//   startDate: string
// }

// export interface Competitor2 {
//   wins: number
//   uid: string
//   ties: number
//   id: string
//   team: Team5
// }

// export interface Team5 {
//   $ref: string
// }

// export interface Event {
//   id: string
//   $ref: string
// }

// export interface Status {
//   type: Type3
// }

// export interface Type3 {
//   name: string
//   description: string
//   id: string
//   state: string
//   completed: boolean
//   detail: string
//   shortDetail: string
// }

// export interface Season {
//   year: number
//   type: number
// }

// export interface BoxScore {
//   teams: Team6[]
//   players: Player[]
// }

// export interface Team6 {
//   homeAway: string
//   displayOrder: number
//   team: Team7
//   statistics: Statistic[]
// }

// export interface Team7 {
//   shortDisplayName: string
//   uid: string
//   alternateColor: string
//   color: string
//   displayName: string
//   name: string
//   logo: string
//   location: string
//   id: string
//   abbreviation: string
//   slug: string
// }

// export interface Statistic {
//   displayValue: string
//   name: string
//   label: string
//   abbreviation?: string
// }

// export interface Player {
//   displayOrder: number
//   team: Team8
//   statistics: Statistic2[]
// }

// export interface Team8 {
//   shortDisplayName: string
//   uid: string
//   alternateColor: string
//   color: string
//   displayName: string
//   name: string
//   logo: string
//   location: string
//   id: string
//   abbreviation: string
//   slug: string
// }

// export interface Statistic2 {
//   names: string[]
//   keys: string[]
//   athletes: Athlete2[]
//   totals: string[]
//   descriptions: string[]
//   labels: string[]
// }

// export interface Athlete2 {
//   reason: string
//   starter: boolean
//   athlete: Athlete3
//   ejected: boolean
//   stats: string[]
//   didNotPlay: boolean
//   active: boolean
// }

// export interface Athlete3 {
//   uid: string
//   displayName: string
//   headshot?: Headshot
//   jersey: string
//   guid: string
//   links: Link3[]
//   id: string
//   position: Position
//   shortName: string
// }

// export interface Headshot {
//   alt: string
//   href: string
// }

// export interface Link3 {
//   rel: string[]
//   href: string
//   text: string
// }

// export interface Position {
//   displayName: string
//   name: string
//   abbreviation: string
// }

// export interface SeasonSery {
//   summary: string
//   totalCompetitions: number
//   description: string
//   completed: boolean
//   type: string
//   title: string
//   events: Event2[]
// }

// export interface Event2 {
//   date: string
//   uid: string
//   competitors: Competitor3[]
//   statusType: StatusType
//   timeValid: boolean
//   links: Link5[]
//   id: string
//   status: string
// }

// export interface Competitor3 {
//   homeAway: string
//   score: string
//   winner?: boolean
//   team: Team9
// }

// export interface Team9 {
//   uid: string
//   displayName: string
//   logo: string
//   links: Link4[]
//   id: string
//   abbreviation: string
//   logos: Logo3[]
// }

// export interface Link4 {
//   href: string
//   text: string
// }

// export interface Logo3 {
//   lastUpdated: string
//   width: number
//   alt: string
//   rel: string[]
//   href: string
//   height: number
// }

// export interface StatusType {
//   name: string
//   description: string
//   id: string
//   state: string
//   completed: boolean
//   detail: string
//   shortDetail: string
// }

// export interface Link5 {
//   isExternal: boolean
//   shortText: string
//   rel: string[]
//   language: string
//   href: string
//   text: string
//   isPremium: boolean
// }

// export interface Standings {
//   fullViewLink: FullViewLink
//   header: string
//   groups: Group[]
// }

// export interface FullViewLink {
//   text: string
//   href: string
// }

// export interface Group {
//   header: string
//   href: string
//   standings: Standings2
// }

// export interface Standings2 {
//   entries: Entry[]
// }

// export interface Entry {
//   uid: string
//   stats: Stat[]
//   link: string
//   logo: Logo4[]
//   team: string
//   id: string
// }

// export interface Stat {
//   shortDisplayName: string
//   displayValue: string
//   displayName: string
//   name: string
//   description: string
//   abbreviation: string
//   type: string
//   value: number
// }

// export interface Logo4 {
//   lastUpdated: string
//   width: number
//   alt: string
//   rel: string[]
//   href: string
//   height: number
// }


// function convertWNBANewToOld(data: ConvertNewToOldParams[]) {

function convertWNBANewToOld(data) {
  try {
    if (!data || data.length === 0) return [];

    console.log(data);

    return data.map((item) => {
      console.log("wnba : ", item.id, item.gameDetail.teams);

      return {
        id: item.id,
        GameID: item.id,
        Season: "",
        Day: item.date, // Assuming start date is the game day
        Status: item.completed,
        Quarter: null,
        Updated: new Date().toISOString(), // Placeholder for updated time
        AwayTeam: item.teams[1].name,
        DateTime: item.date,
        HomeTeam: item.teams[0].name,
        IsClosed: item.completed, // Assuming 2 means the game is finished
        LastPlay: "", // No direct mapping available
        Quarters: item.gameDetail.teams?.[0]?.linescores?.map((_, i) => (i === 4 ? {
          Name: (i + 4).toString(),
          GameID: item.id,
          Number: i + 4,
          AwayScore: item.gameDetail.teams[0].linescores[i].displayValue ? +item.gameDetail.teams[0].linescores[i].displayValue : 0,
          HomeScore: item.gameDetail.teams[1].linescores[i].displayValue ? +item.gameDetail.teams[1].linescores[i].displayValue : 0,
        } : {
          Name: (i + 1).toString(),
          GameID: item.id,
          Number: i + 1,
          AwayScore: item.gameDetail.teams[0].linescores[i].displayValue ? +item.gameDetail.teams[0].linescores[i].displayValue : 0,
          HomeScore: item.gameDetail.teams[1].linescores[i].displayValue ? +item.gameDetail.teams[1].linescores[i].displayValue : 0,
          QuarterID: 171148 + i
        })) ?? [],
        UmpireID: null,
        OverUnder: 0, // No direct mapping
        RefereeID: null,
        StadiumID: 0, // No direct mapping
        Attendance: null,
        AwayTeamID: item.teams[1].id,
        HomeTeamID: item.teams[0].id,
        OverPayout: 0, // No direct mapping
        SeasonType: 0, // No direct mapping
        SeriesInfo: null,
        AlternateID: null,
        CrewChiefID: null,
        DateTimeUTC: item.date, // Assuming same as DateTime
        PointSpread: 0, // No direct mapping
        UnderPayout: 0, // No direct mapping
        GlobalGameID: item.id,
        NeutralVenue: false, // No direct mapping
        AwayTeamScore: 0,
        HomeTeamScore: 0,
        GameEndDateTime: null, // No direct mapping
        GlobalAwayTeamID: item.teams[1].id,
        GlobalHomeTeamID: item.teams[0].id,
        AwayTeamMoneyLine: 0, // No direct mapping
        HomeTeamMoneyLine: 0, // No direct mapping
        AwayRotationNumber: 0, // No direct mapping
        HomeRotationNumber: 0, // No direct mapping
        InseasonTournament: false, // No direct mapping
        TimeRemainingMinutes: null, // No direct mapping
        TimeRemainingSeconds: null, // No direct mapping
        PointSpreadAwayTeamMoneyLine: 0, // No direct mapping
        PointSpreadHomeTeamMoneyLine: 0, // No direct mapping
        competitions: item.gameDetail.teams?.[0]?.linescores?.map((score, i) => ({
          Name: (i + 1).toString(),
          GameID: item.id,
          Number: i + 1,
          AwayScore: item.gameDetail.teams[0].linescores[i].displayValue ? +item.gameDetail.teams[0].linescores[i].displayValue : 0,
          HomeScore: item.gameDetail.teams[1].linescores[i].displayValue ? +item.gameDetail.teams[1].linescores[i].displayValue : 0,
          QuarterID: 171148 + i
        })) ?? [],
        rounds: [],
        currentTeam: item.teams[0].name,
        defeatTeam: item.teams[1].name,
        currentTeamLogo: item.teams[0].logo,
        defeatTeamLogo: item.teams[1].logo,
        Channel: "", // No direct mapping
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function convertPlayerNewToOldWNBA(params) {
  return params.map((player) => ({
    Key: player.team.id,
    City: player.city || "",
    Name: player.team.displayName,
    Active: player.nbaFranchise,
    TeamID: player.team.id,
    LeagueID: player?.leagues?.standard ? 1 : 0, // Example logic
    GlobalTeamID: player.team.id,
    NbaDotComTeamID: player.team.id,
    WikipediaLogoUrl: player.team.logos?.[0]?.href || "",
    WikipediaWordMarkUrl: null,
  }));
}

module.exports = { convertWNBANewToOld, convertPlayerNewToOldWNBA };