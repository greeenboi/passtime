type boredAPIType = {
    accessibility : number,
    activity : string,
    key : string,
    link : string,
    participants : number,
    price : number,
    type : string
}

type agifyAPIType ={
    count : number,
    name : string,
    age : number,
}

type genderizeAPIType = {
    count: number,
    name: string,
    gender: string,
    probability: number
}


export type { boredAPIType, agifyAPIType, genderizeAPIType }
