import '../style/Findings.css'

export function Findings() {

    return(
        <div className="container-findings">

            <h1 className="header-findings">Interesting findings</h1>

            <div className="finding1">
                <h2 className="info-h2">The top 4 cities have almost the same average parking capacity... why is that?</h2>
                <p className="info-p">According to a report of the Ministerie van 
                Infrastructuur en Waterstaat, I found that most public parking 
                garages are built in the bigger cities. I think that there is a 
                connection between population density and average parking capacity. It is optimal to have around the 300 parking spots per parking garage in each capital city of Groningen, Flevoland, Zuid-holland and Noord-holland.</p>
            </div>

            <div className="finding2">
                <h2 className="info-h2">Zuid-Holland has the most total parking spots per province by a large margin. But if you look at the
                average you notice that it has almost as much average parking capacity as the 3 provinces under it. Is there any reason for that?</h2>
                <p className="info-p">The reason that Zuid-Holland has way more parking garages than all the other provinces, is because of urban construction plans.
                According to the government website of Zuid-Holland there were a lot of parking garages built because there is a 
                municipal parking norm that has to be adhered. According to the parking norm, for each house that is built, there has to be a number
                of parking spots built. Because there are so much parking garages, Zuid-Holland is suffering from structully vacant parking garages.</p>
                <p className="info-p">
                    Because of such a low demand of parking garages, many projects are delayed or completely canceled. These projects
                    have to adhere to the parking norms. Building these garages won't be profitable for the investors.
                </p>
            </div>
            
        </div>
    )
}

