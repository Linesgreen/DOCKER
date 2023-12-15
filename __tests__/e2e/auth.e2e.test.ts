// noinspection DuplicatedCode,LocalVariableNamingConventionJS,MagicNumberJS

import {app, RouterPaths} from "../../src/setting";
import request from 'supertest'
import {UserCreateModel} from "../../src/types/users/input";
import {usersTestManager} from "../utils/usersTestManager";
import {UserOutputType} from "../../src/types/users/output";


describe('/auth', () => {
    // Очищаем БД
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
    });

    /*/СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ ДЛЯ ДАЛЬНЕЙШИХ ТЕСТОВ/*/
    //данные для создания пользователя
    const userData: UserCreateModel = {
        "login": "qqTSsPPMfL",
        "password": "string",
        "email": "linsegreen@mail.ru"
    };
    const basicAuth = {
        login: 'admin',
        password: 'qwerty'
    };


    //Данные созданного пользователя
    let user1: UserOutputType;


    //Cоздаем пользователя
    it("should create user with correct input data ", async () => {
        const createResponse = await usersTestManager.createUser(userData, basicAuth, 201);
        user1 = createResponse.body;
    });
    //Пытаемся залогинится с неправильным паролем
    it("should dont loggin with incorrect pass ", async () => {
        await request(app)
            .post(`${RouterPaths.auth}/login`)
            .send({
                loginOrEmail: userData.login,
                password: 'xernya'
            })
            .expect(401)
    });
    //Пытаемся залогинится с неправильным логином
    it("should dont login with incorrect login ", async () => {
        await request(app)
            .post(`${RouterPaths.auth}/login`)
            .send({
                loginOrEmail: 'userData.login',
                password: userData.login
            })
            .expect(401)
    });
    //Пытаемся залогинится с некоректными данными
    it("should dont login with incorrect login ", async () => {
        await request(app)
            .post(`${RouterPaths.auth}/login`)
            .send({
                loginOrEmail: 1,
                password: 2
            })
            .expect(400, {
                "errorsMessages": [
                    {
                        "message": "Incorrect loginOrEmail",
                        "field": "loginOrEmail"
                    }
                ]
            })
    });
    //Логинимся по логину
    it("should  login with correct login ", async () => {
        await request(app)
            .post(`${RouterPaths.auth}/login`)
            .send({
                loginOrEmail: userData.login,
                password: userData.password
            })
            .expect(200)
            .then(response => {
                expect(response.body.accessToken).toMatch(
                    /^([a-zA-Z0-9\-_=]+)\.([a-zA-Z0-9\-_=]+)\.([a-zA-Z0-9\-_=]+)$/
                )
            })
    });
    let token: string;
    //Логинимся по мылу
    it("should  login with correct email ", async () => {
        await request(app)
            .post(`${RouterPaths.auth}/login`)
            .send({
                loginOrEmail: userData.email,
                password: userData.password
            })
            .expect(200)
            .then(response => {
                token = response.body.accessToken;
                expect(response.body.accessToken).toMatch(
                    /^([a-zA-Z0-9\-_=]+)\.([a-zA-Z0-9\-_=]+)\.([a-zA-Z0-9\-_=]+)$/
                )
            })
    });
    //Получаем информацию о пользователе
    it("should  login with correct email ", async () => {
        await request(app)
            .get(`${RouterPaths.auth}/me`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200, {
                "email": userData.email,
                "login": userData.login,
                "userId": user1.id
            })

    });
    //Пытаемся получить информацию с некоректным токеном
    it("should  login with correct email ", async () => {
        await request(app)
            .get(`${RouterPaths.auth}/me`)
            .set('Authorization', `Bearer tGzv3JOkF0XG5Qx2TlKWIA`)
            .expect(401)

    })


});