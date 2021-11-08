import '../style/Intro.css'

export function Intro() {

    return(
        <div className="container-intro">

            <div className="info-concept">
                <h2 className="info-h2">Why this concept?</h2>
                <p className="info-p">De Volkskrant gave me the task to make an interesting datavisualisation regarding the car in the city.
                    The reason that I chose this concept is that I had no idea how many parking garages there are in the Netherlands. I know for example that in Amsterdam, 
                    there are a lot of parking garages because it is a busy city. But is there aside from it being a busy city another reason to have a lot of parking garages? 
                    </p>

                    <p className="info-p">This question gave me the inspiration to focus on this concept and try to get interesting insights out of it.
                    I want to widen the scope and find out if there are any more relations per province.</p>
            </div>

            <div className="info-dataset">
                <h2 className="info-h2">What data did I use?</h2>
                <p className="info-p">By using the data from RDW I was able to make a datavisualisation. I used the location and parking capacity of each garage. I transformed
                this data in a bar chart which you can filter in three ways. You can see the total parking spots per province, the average parking spots per province and
                the garage with the highest parking capacity of that province.</p>
            </div>

        </div>
    )
}