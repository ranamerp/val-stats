export const load = async ( { fetch }) => {
    const region = 'na'
    const name = 'katsumi'
    const tag = 'fps'
    //Needs to be error checking here to see if api is correctly getting data. For now download json and use that as basis for program. 
    //const matchreq = await fetch(`https://api.henrikdev.xyz/valorant/v3/matches/${region}/${name}/${tag}`)
    //const matchData = await matchreq.json()
    const matchreq = await fetch('ref.json')
    const matchData = await matchreq.json()
    const data = matchData.data

    //From here, this needs to send all the match objects where mode is custom (maybe in a list? Can js iterate through a json?)
    return {
        stats: data
    }
}
