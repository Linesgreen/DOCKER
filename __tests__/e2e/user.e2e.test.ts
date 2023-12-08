// noinspection MagicNumberJS,LocalVariableNamingConventionJS,ReuseOfLocalVariableJS

import request from "supertest";
import {app, RouterPaths} from "../../src/setting";
import {blogTestManager} from "../utils/blogTestManager";
import {UserOutputType} from "../../src/types/users/output";
import {UserCreateModel} from "../../src/types/users/input";


describe('/posts',
    () => {

        // Очищаем БД
        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data')
        });

        // Проверяем что БД пустая
        it('should return 200 and empty []', async () => {
            await request(app)
                .get(RouterPaths.users)
                .auth('admin', 'qwerty')
                .expect(200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
        });

        const wrongUserData: UserCreateModel = {
            "login": "",
            "password": "",
            "email": "TN"
        };
        const userData: UserCreateModel = {
            "login": "qqTSsPPMfL",
            "password": "string",
            "email": "linsegreen@mail.ru"
        };
        //Пытаемся создать пользователя с неправильными данными
        it("should'nt create user with incorrect input data ", async () => {
            //Отсылаем неправильнные данные
            await request(app)
                .post(RouterPaths.users)
                .auth('admin', 'qwerty')
                .send(wrongUserData)
                .expect(400, {
                    "errorsMessages": [
                        {
                            "message": "Incorrect login",
                            "field": "login"
                        },
                        {
                            "message": "Incorrect password",
                            "field": "password"
                        },
                        {
                            "message": "Invalid value",
                            "field": "email"
                        }
                    ]
                })
        });
        //Пытаемся создать пользователя без basic проверки логина и пароля
        it("should'nt create user with login and pass ", async () => {
            //Отсылаем неправильнные данные
            await request(app)
                .post(RouterPaths.users)
                .auth('adminn', 'qwertyy')
                .send(userData)
                .expect(401, "Unauthorized")
        });
        let user1: UserOutputType;
        let user2: UserOutputType;
        //Cоздаем пользователя
        it("should create user with correct input data ", async () => {
            //Отсылаем неправильнные данные
            await request(app)
                .post(RouterPaths.users)
                .auth('admin', 'qwerty')
                .send(userData)
                .expect(201)
                .then(response => {
                    user1 = response.body;
                    expect(response.body).toEqual({
                        id: expect.any(String),
                        login: 'qqTSsPPMfL',
                        email: 'linsegreen@mail.ru',
                        createdAt: expect.any(String)
                    })
                });
        });

        //Cоздаем 2 пользователя
        it("should create user 2 with correct input data ", async () => {
            //Отсылаем неправильнные данные
            await request(app)
                .post(RouterPaths.users)
                .auth('admin', 'qwerty')
                .send(userData)
                .expect(201)
                .then(response => {
                    user2 = response.body;
                    expect(response.body).toEqual({
                        id: expect.any(String),
                        login: 'qqTSsPPMfL',
                        email: 'linsegreen@mail.ru',
                        createdAt: expect.any(String)
                    })
                });
            // Проверяем что созданные айди у двух юзеров разные
            expect(user1.id).not.toEqual(user2.id);

            //Проверяем что в базе находятся два пользователя
            await request(app)
                .get(RouterPaths.users)
                .auth('admin', 'qwerty')
                .expect(200)
                .then(response => {
                    expect(response.body).toEqual({
                        "pagesCount": 1,
                        "page": 1,
                        "pageSize": 10,
                        "totalCount": 2,
                        "items": [user2, user1]
                    })

                })
        });
        ///////////////////////////////////
        /* Проверяем query запросы !!!🥲 */
        ///////////////////////////////////
        let user3: UserOutputType;
        let user4: UserOutputType;
        let user5: UserOutputType;
        it("should CREATE  3 users with correct input data ", async () => {
            //Создаем еще 3 юзера
            user3 = (await blogTestManager.createUser(userData, 201)).body;
            user4 = (await blogTestManager.createUser(userData, 201)).body;
            user5 = (await blogTestManager.createUser(userData, 201)).body;
        });

        //Проверяем наличие 5 постов в блоке с сортировкой по умлочанию
        it("should return 5 posts for createdBlog ", async () => {
            await request(app)
                .get(`${RouterPaths.users}`)
                .auth('admin', 'qwerty')
                .expect(200, {
                    "pagesCount": 1,
                    "page": 1,
                    "pageSize": 10,
                    "totalCount": 5,
                    "items": [user5, user4, user3, user2, user1]
                })
        });
        //Проверяем наличие 5 постов в блоке с сортировкой asc
        it("should return 5 users for createdBlog ", async () => {
            await request(app)
                .get(`${RouterPaths.users}/?sortDirection=asc`)
                .auth('admin', 'qwerty')
                .expect(200, {
                    "pagesCount": 1,
                    "page": 1,
                    "pageSize": 10,
                    "totalCount": 5,
                    "items": [user1, user2, user3, user4, user5]
                })
        });
        //Проверяем pageSize = 1 | asc
        it("should return 1 user for createdBlog ", async () => {
            await request(app)
                .get(`${RouterPaths.users}/?sortDirection=asc&pageSize=1`)
                .auth('admin', 'qwerty')
                .expect(200, {
                    pagesCount: 5,
                    page: 1,
                    pageSize: 1,
                    totalCount: 5,
                    items: [user1]
                })
        });
        //Проверяем pageSize = 1 | desc
        it("should return 5 posts for createdBlog ", async () => {
            await request(app)
                .get(`${RouterPaths.users}/?pageSize=1`)
                .auth('admin', 'qwerty')
                .expect(200, {
                    pagesCount: 5,
                    page: 1,
                    pageSize: 1,
                    totalCount: 5,
                    items: [user5]
                })
        });
        //Проверяем pageSize = 1 и pageNumber 2 | desc
        it("should return 1 user for createdBlog ", async () => {
            await request(app)
                .get(`${RouterPaths.users}/?pageSize=1&pageNumber=2`)
                .auth('admin', 'qwerty')
                .expect(200, {
                    pagesCount: 5,
                    page: 2,
                    pageSize: 1,
                    totalCount: 5,
                    items: [user4]
                })
        });

    });