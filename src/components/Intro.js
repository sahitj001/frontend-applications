import '../style/Intro.css'

export function Intro() {

    return(
        <div className="container-intro">

            <div className="info-concept">
                <h2 className="info-h2">The challenge</h2>
                <p className="info-p">De Volkskrant gave me the task to make an interesting datavisualisation regarding the car in the city.
                    I wanted to know if there was a connection between the number of parking spots and province. I know for example that in Amsterdam, 
                    there are a lot of parking garages because it is a busy city. But is there aside from it being a busy city another reason to have a lot of parking garages? 
                    </p>
            </div>

            <div className="info-dataset">
                <h2 className="info-h2">What data did I use?</h2>
                <p className="info-p">By using the data from RDW I was able to make a datavisualisation. I used the location and parking capacity of each garage. I transformed
                this data in a bar chart which you can switch from three views: Average capacity of parking spots per province, total parking spots per province and you will be able to see how much parking capacity the biggest garage has of each province.</p>

            </div>

        </div>
    )
}