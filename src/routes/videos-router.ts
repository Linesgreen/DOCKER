/*
import {Request, Response, Router} from "express";
import {
    ErrorMessagesType,
    ErrorType,
    PostReqBody,
    RequestWithBody,
    RequestWithBodyAndParams,
    RequestWithParams,
} from "../types/common";

import {VideoCreateModel} from "../model/VideosCreateModels";
import {VideoGetModel} from "../model/VideoGetModel";
import {VideoUpdateModelBody, VideoUpdateModelId} from "../model/VideoUpdateModel";
import {VideoDeleteModel} from "../model/VideoDeleteModel";
import {VideoViewModel} from "../model/VideosViewModel";
import {db} from "../db/db";
import {AvailableResolutions, VideoType} from "../types/videos/output";

export const videoRouter = Router ({});
function validationReqBody (reqParams : string, maxLength : number) : boolean {
    return typeof reqParams  != 'undefined' && typeof reqParams  === 'string' && reqParams.trim().length < maxLength &&  reqParams.trim().length >= 1
}
function generateError(message : string, field : string) : ErrorMessagesType {
    return  {
        message : message,
        field : field
    }
}

videoRouter.get('/', (req : Request, res : Response<VideoViewModel[]>) => {
    res.status(200).send(db.videos);
})
videoRouter.get(`/:id`,(req:RequestWithParams<VideoGetModel>, res: Response<VideoViewModel>) =>{
    const  id: number = +req.params.id
    const video : VideoType | undefined = db.videos.find(v => v.id === id)
    if (!video) {
        res.sendStatus(404)
        return
    }

    res.send(video);
})
videoRouter.post('/', (req : RequestWithBody<VideoCreateModel>, res : Response<VideoViewModel> & Response<ErrorType>) => {
    let error : ErrorType = {
        errorsMessages: []
    }

    let {title, author, availableResolutions} : PostReqBody = req.body

    if(!validationReqBody(title, 40)) {
        error.errorsMessages.push(generateError("Invalid title", 'title'))

    }
    if(!validationReqBody(author, 20)) {
        error.errorsMessages.push(generateError("Invalid author", 'author'))
    }

    if(Array.isArray(availableResolutions)) {
        availableResolutions.map(r => {
            !AvailableResolutions.includes(r) &&
            error.errorsMessages
                .push(generateError("Invalid availableResolutions", 'availableResolutions'))
        })
    } else {
        availableResolutions = [];
    }

    if (error.errorsMessages.length) {
        res.status(400).send(error)
        return
    }

    const createdAT : Date = new Date()
    const publicationDate : Date = new Date()
    publicationDate.setDate(createdAT.getDate() + 1)

    const newVideo : VideoType = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAT.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    }

    db.videos.push(newVideo)
    res.status(201).send(newVideo)
})
videoRouter.put(`/:id`,(req: RequestWithBodyAndParams<VideoUpdateModelId, VideoUpdateModelBody>, res : Response<VideoViewModel> & Response<ErrorType>) => {

    const  id: number = +req.params.id

    let error : ErrorType = {
        errorsMessages: []
    }


    let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} : VideoUpdateModelBody = req.body
    if(!validationReqBody(title, 40)) {
        error.errorsMessages.push({
            message : "Invalid title",
            field : 'title'
        })
    }

    if(!validationReqBody(author, 20)) {
        error.errorsMessages.push({

            message : "Invalid author",
            field : 'author'
        })
    }

    if(Array.isArray(availableResolutions)) {
        availableResolutions.map(r => {
            !AvailableResolutions.includes(r) && error.errorsMessages.push({
                message : "Invalid availableResolutions",
                field : 'availableResolutions'
            })
        })
    } else {
        availableResolutions = [];
    }



    if (typeof canBeDownloaded === 'undefined' ) {
        canBeDownloaded = false;
    }
    if(typeof canBeDownloaded != "boolean") {
        error.errorsMessages.push({
            message : "Invalid canBeDownloaded",
            field : 'canBeDownloaded'
        })
    }

    const dateInspection: boolean = (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/gi).test(publicationDate);
    if (typeof publicationDate != "undefined" && !dateInspection ) {
        error.errorsMessages.push({
            message : "Invalid publicationDate",
            field : 'publicationDate'
        })
    }


    if (typeof minAgeRestriction !== 'undefined' && typeof minAgeRestriction === "number" ) {
        minAgeRestriction < 1 || minAgeRestriction > 18  &&  error.errorsMessages.push({
            message : "Invalid minAgeRestriction",
            field : 'minAgeRestriction'
        })
    } else {
        minAgeRestriction = null;
    }

    if (error.errorsMessages.length) {
        res.status(400).send(error)
        return
    }


    const videoIndex : number = db.videos.findIndex(v => v.id == id);
    const video : VideoType | undefined = db.videos.find(v =>  v.id === id );

    if (!video) {

        res.sendStatus(404)
        return;
    }

    const updateItems : VideoType = {
        ...video,
        canBeDownloaded,
        minAgeRestriction,
        title,
        author,
        publicationDate : publicationDate ? publicationDate : video.publicationDate,
        availableResolutions
    }

    db.videos.splice(videoIndex, 1, updateItems)
    res.sendStatus(204)

})
videoRouter.delete(`/:id`, (req:RequestWithParams<VideoDeleteModel>, res : Response ) =>{
    const  id: number = +req.params.id


    const  videoIndex = db.videos.findIndex(v => v.id === id);
    if (videoIndex === -1) {
        res.sendStatus(404)
        return
    }


    db.videos.splice(videoIndex, 1);

    res.sendStatus(204)

})


 */