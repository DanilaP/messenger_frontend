interface IPublicationFile {
    url: string,
    size: string,
    type: string
}

export interface IPublication {
    id: number,
    userId: number,
    text: string,
    date: string,
    file: IPublicationFile
}

export interface IGetPublicationsResponse {
    data: {
        message: string,
        publications: IPublication[]
    }
}