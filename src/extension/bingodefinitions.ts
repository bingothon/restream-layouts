const definitions: { [key: string]: string } = {
    single: 'In single bingo you need to complete a row/column/diagonal with 5 goals to finish',
    double: 'In double bingo you need to complete 2 rows/columns/diagonals with 5 goals each to finish, they may overlap',
    triple: 'In triple bingo you need to complete 3 rows/columns/diagonals with 5 goals each to finish, they may overlap',
    lockout: 'In lockout bingo each goal can only be claimed by the one player clicking it first, the first player locking up the majority of the goals (13) wins',
    blackout: 'In blackout bingo every goal on the board has to be done',
    'lockout invasion': 'In lockout invasion bingo the players start marking goals on opposite sides and try to progress toward the opponents side. A goal can only be marked by one player and they can only mark as much goals as they have on the previous row/column on their side: https://imgur.com/2WPnvHQ ',
    cinco: 'In cinco bingo the players have to get 5 rows/columns/diagonals with 5 goals each to finish, they may overlap',
    exploration: 'In Exploration Bingo all goals except 2 goals are hidden and can be revealed by completing adjacent goals, blackout means all goals',
    rowcontrol: 'In row control the players try to get the most goals in one row. As soon as a player completes 3 goals in a row, he controls this row. The first player to control 3 rows wins. This is a Lockout variant, meaning as soon as goal is clicked by one player it cannot be clicked by another player anymore',
    invasion: 'In lockout invasion bingo the players start marking goals on opposite sides and try to progress toward the opponents side. A goal can only be marked by one player and they can only mark as much goals as they have on the previous row/column on their side: https://docs.google.com/document/d/1Iz8-tzNy3Lk1Gq4sCdVa8hWeJE2A0I7KjNpJy6Z4cnk',
    draftlockout: 'In addition to normal lockout rules, the players get to draft 5 goals in the beginning, only they are allowed to complete for the first 30 minutes. If these goals are not completed after 30 minutes they become free to claim for everyone. A player may not delay their own draft goals.',
    connect5: 'A player wins by achieving 13 goals on the card or a single bingo line. Goals in this line may not be delayed.',
    coop: ', the players of a team share the same color on the board and work together',
    'double anti': 'In double anti bingo, each player selects a row/column/diagonal for their opponent and chooses an additional line for themselves to complete',
    'battleships': 'In Battleship bingo, each team places 2,3 and 4 square long battleships on the board, hidden from the other team, which may not overlap. Goal is to sink all of the other teams ships',
};

export default definitions;
