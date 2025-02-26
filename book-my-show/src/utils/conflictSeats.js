export const setConflictSeatLocally = (showId, theatreId, seatRow, seatNumber, screenNo, seatClass, seatPrice, seatIndex, date) => {
    const prevConflictedSeats = getConflictedSeatsLocally() || {};
    const value = `${showId}-${theatreId}-${screenNo}-${date}`;
    const data = {
        seatRow, 
        seatNumber,
        seatClass,
        seatIndex, 
        time: Date.now()
    }
    prevConflictedSeats[value] ? prevConflictedSeats[value].push(data) : prevConflictedSeats[value] = [data]
    return localStorage.setItem('conflict-seats', JSON.stringify(prevConflictedSeats));
};

const getConflictedSeatsLocally = () => {
    const conflictedSeats = localStorage.getItem('conflict-seats');
    return JSON.parse(conflictedSeats)
};


export const getSeatLayoutWithConflicts = (seatLayout, showId,  theatreId, screenNo, date) => {
    const timeInterval = 2 * 60 * 1000;

    //firse remove all the deprecated seats 

    const prevConflictedSeats = getConflictedSeatsLocally() || {};
    const currentTimestamp = Date.now();
    const updatedConflictedSeats = {};
    
    Object.keys(prevConflictedSeats).forEach(key => {
        updatedConflictedSeats[key] = prevConflictedSeats[key].filter(seat => {
            return (currentTimestamp - seat.time) < timeInterval;
        });
    });

    // now update the seats 
    const value = `${showId}-${theatreId}-${screenNo}-${date}`;
    if(updatedConflictedSeats[value]){
        updatedConflictedSeats[value]?.forEach(seat => {
            seatLayout?.map(theatreSeat => {
                if(theatreSeat.name  == seat.seatClass){
                    theatreSeat?.seats?.map(row =>{
                        if(row.row == seat.seatRow){
                            row['status'][seat.seatIndex] = "booked"
                        }
                    })
                }
            })
        })
    }
    return seatLayout
};
