# UI Dev Design Document

## Routing

   - Index Page: ```/```  => Redirect to Markets Page
   - Markets Page: ```/markets```
   - Statement Page: ```/Statement```
   - Market Detail Page: ```/markets/{market_id}```
   - Markets Admin Page: ```/admin/markets```
   - Create Market: ```/admin/markets/new```
   - Edit Market: ```/admin/markets/{market_id}```
   - LeaderboardPage: ```/leaderboard```


## Components Hierarchy

``` mermaid

graph LR;

style MarketsContext fill:#D4E2D4
style StatementContext fill:#D4E2D4
style MarketDetailContext fill:#D4E2D4
style AdminContext fill:#D4E2D4

APP(APP)-->IndexPage(Index Page);

IndexPage(Index Page)-->MarketsPage(Markets Page);
LeaderboardPage(Leaderboard Page)-->ProphetsBoard(Prophets Board);
LeaderboardPage(Leaderboard Page)-->HotMarketsBoard(Hot Markets Board);

IndexPage(Index Page)-->LeaderboardPage(Leaderboard Page);

subgraph MarketsContext [All Markets]

    MarketsPage(Markets Page)--Opened Markets-->OpenedMarketsBoard(Opened Markets Board);
    MarketsPage(Markets Page)--Closed Markets-->ClosedMarketsBoard(Closed Markets Board);
    OpenedMarketsBoard(Opened Markets Board)--Opened Market-->OpenedMarketCard(Opened Market Card);

end

ClosedMarketsBoard(Closed Markets Board)--Closed Market-->ClosedMarketCard(Closed Market Card);

subgraph AccountContext [Account]

    IndexPage(Index Page)--Account-->Header(Header);
    IndexPage(Index Page)--Account-->StatementPage(Statement Page);
    IndexPage(Index Page)--Account & MarketId-->MarketDetailPage(Market Detail Page);
    IndexPage(Index Page)--Account-->MarketsAdminPage(Markets Admin Page);
    IndexPage(Index Page)--Account-->CreatingMarketPage(Creating Market Page);
    IndexPage(Index Page)--Account-->EditingMarketPage(Editing Market Page);

    Header(Header)-->HomeLink(Home Link);
    Header(Header)-->LoginLink(Login Link);
    Header(Header)-->LogoutLink(Logout Link);
    Header(Header)-->AccountInfoDialog(Account Info Dialog);
    Header(Header)-->ContextMenu(Context Menu);

    subgraph StatementContext [User Markets & Bets]
        StatementPage(Statement Page)--My Markets & Bets-->StatementOverview(Statement Overview);
        StatementPage(Statement Page)--My Markets & Bets-->StatementMarketsBoard(Statement Markets Board);
        StatementMarketsBoard(Statement Markets Board)--My Opened Markets & Bets-->MyOpenedMarketsTable(My Opened Markets Table);
        StatementMarketsBoard(Statement Markets Board)--My Closed Markets & Bets-->MyClosedMarketsTable(My Closed Markets Table);
    end

    subgraph MarketDetailContext [Account & The Market]

        MarketDetailPage(Market Detail Page)-->MarketInfo(Market Info);
        MarketDetailPage(Market Detail Page)-->BetsList(Bets List);

    end

    subgraph AdminContext [All Markets]
        MarketsAdminPage(Markets Admin Page)--Opened Markets-->ResolvingMarketsBoard(Resolving Markets Board);
        MarketsAdminPage(Markets Admin Page)--Closed Markets-->ResolvedMarketsBoard(Resolved Markets Board);
        ResolvingMarketsBoard(Resolving Markets Board)--Opened Market-->ResolvingMarketCard(Resolving Market Card);
    end

    CreatingMarketPage(Creating Market Page)-->MarketForm(Market Form)
    EditingMarketPage(Editing Market Page)--MarketId-->MarketForm(Market Form)

end

ResolvedMarketsBoard(Resolved Markets Board)--Closed Market-->ClosedMarketCard(Closed Market Card);

```
