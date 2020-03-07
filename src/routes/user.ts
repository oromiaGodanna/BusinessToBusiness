import {Request, Response} from "express";

export let allUsers = (req: Request, res: Response) => {
    res.send("returns all ussers");
;}

export let addUser = (req: Request, res: Response) => {
    res.send("Adds a new user");
;}


//Api Endpoints
