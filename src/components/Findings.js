import '../style/Findings.css'

export function Findings() {

    return(
        <div className="container-findings">

            <h1 className="header-findings">Interesting findings</h1>

            <div className="finding1">
                <h2 className="info-h2">The top 4 cities have almost the same average parking capacity... why is that?</h2>
                <p className="info-p">According to a report of the Ministerie van 
                Infrastructuur en Waterstaat, I found that it is optimal to have around the 300 parking spots per parking garage in each capital city of Groningen, Flevoland, Zuid-holland and Noord-holland.</p>
            </div>

            <div className="finding2">
                <h2 className="info-h2">
    Zuid-Holland has the most total parking spots per province by a large margin. But if you look at the average, you notice that it contains about as much average parking capacity as Flevoland, Noord-Holland and Groningen. Is there a specific reason for that?
</h2>
                <p className="info-p">The reason that Zuid-Holland has way more parking garages than all the other provinces, is because of urban construction plans.
                According to the government website of Zuid-Holland there were a lot of parking garages built because, there is a 
                municipal parking norm that has to be adhered. According to the parking norm, for each house that is built, there has to be a number
                of parking spots built. This doesn't mean that every parking spot will be filled. Zuid-Holland is currently suffering from structully vacant parking garages.</p>
                <p className="info-p">
                    Because of such a low demand of parking garages, many projects are delayed or completely canceled. The main reason for this is that every project has to adhere to the parking norms. 
                    Building these garages isn't profitable for the investors.
                </p>
            </div>
            
        </div>
    )
}

