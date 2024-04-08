// Your code here
document.addEventListener('DOMContentLoaded', () => {
    //GET request to obtain all movie titles from the server
    fetch("http://localhost:3000/films")
        .then(res => res.json())
        .then(data => {
            // selects the movie list and removes the content that was initially encoded into the HTML file
            let titleList = document.querySelector("ul#films")
            titleList.querySelector("li").remove()
            data.forEach((item) => {
            // for each of the movie titles, a new list element is created in the movies list and the corresponding movie title is displayed
                let list = document.createElement("li")
                list.textContent = `${item.title} `
                // the new list element is assigned a class name of "film item" and appended to the movie list 
                list.className = "film item"
                titleList.appendChild(list)
                // a delete button is then created to delete the movie titles once it is pressed 
                let btn = document.createElement("button")
                btn.textContent = " X"
                list.appendChild(btn)
                btn.addEventListener("click", (e) => {
                    e.target.parentNode.remove()
                // a DELETE request is then made to the server to remove the movie from the server once the delete button is clicked
                    fetch(`http://localhost:3000/films/${item.id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                    })
                        .then(res => res.json())
                        .then(data => console.log(data))
                        .catch (error => {
                            alert ("DELETE ERROR")
                            console.log(error.message)
                        })
                })
            })
            fetch("http://localhost:3000/films/1")
                // GET request to obtain the first movie's details from the server
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    // Displays the first movie's title when the page loads
                    let title = document.querySelector("#title")
                    let movieTitle = document.createElement("p")
                    movieTitle.textContent = (data.title)
                    title.textContent = ""
                    title.appendChild(movieTitle)

                    // Displays the first movie's runtime when the page loads
                    let runtime = document.querySelector("#runtime")
                    let runtimeMovie = document.createElement("p")
                    runtimeMovie.textContent = `${data.runtime} minutes`
                    runtime.textContent = ""
                    runtime.appendChild(runtimeMovie)

                    // Displays the first movie's description when the page loads
                    let description = document.querySelector("#film-info")
                    let desMovie = document.createElement("p")
                    desMovie.textContent = (data.description)
                    description.textContent = ""
                    description.appendChild(desMovie)

                    // Displays the first movie's showtime when the page loads
                    let showtime = document.querySelector("#showtime")
                    let showtimeMovie = document.createElement("p")
                    showtimeMovie.textContent = (data.showtime)
                    showtime.textContent = ""
                    showtime.appendChild(showtimeMovie)

                    // calculates the remaining tickets of the first movie and displays when the page loads
                    let remTickets = document.querySelector("#ticket-num")
                    let result = data.capacity - data.tickets_sold
                    remTickets.textContent = result
                    // Displays the first movie's poster when the page loads
                    let image = document.querySelector("#poster")
                    image.src = data.poster
                    image.alt = data.title
                    // Adds an event listener to the "Buy Tickets" button to allow it to after the number of tickets remaining
                    document.querySelector("button#buy-ticket").addEventListener("click", (event) => {
                        // tickets can only be bought if the number of remaining tickets is greater than zero
                        if (result > 0) {
                            // once the button is clicked, the number of tickets sold increases by one
                            data.tickets_sold += 1
                            result = data.capacity - data.tickets_sold
                            // the new result is then calculated and then displayed on the page
                            document.querySelector("span#ticket-num").textContent = result
                            // the number of tickets of the movie are added to the server each time the button is clicked
                            newTickets({
                                film_id: data.id,
                                number_of_tickets: result
                            })
                            // the number of tickets sold is updated in the server using the updatePayment function
                            updatePayment(data, data.id)


                        } else {
                            // if there are no more tickets remaining the "Buy Ticket" button text changes to "Sold Out" to indicate that the user can no longer purchase a ticket
                            let btn2 = document.querySelector("button#buy-ticket")
                            btn2.textContent = "Sold Out"
                            btn2.disabled = true
                            let soldOutFilm = titleList.querySelector("li")
                            // the movie title whose tickets are sold out gets a class name of "sold out film item"
                            soldOutFilm.className = "sold out film item"

                        }
                    })

                })
        })

    // This function takes in the new updated object and updates the corresponding object in the server
    function updatePayment(sold, id) {
        // a patch request is made to the server to update the movie's tickets sold value accoreding to the id that is entered
        fetch(`http://localhost:3000/films/${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json",

            },
            body: JSON.stringify(sold)
        })
            .then(res => res.json())
            .then(movie => {
                console.log(movie)
            })
            .catch((error) => {
                alert("ERROR")
                console.log(error.message)
            })

    }
    //the newTickets function adds a new object to the server based on its input, it sends a POST request
    function newTickets(result) {
        fetch("http://localhost:3000/films", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(result)
        })

            .then(res => res.json())
            .then(data => {
                console.log(data)
            })

            .catch(function (error) {
                alert("ERROR")
                console.log(error.message)
            })


    }


})
