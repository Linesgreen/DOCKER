// noinspection LocalVariableNamingConventionJS,MagicNumberJS,FunctionTooLongJS

import request from "supertest";
import {app, RouterPaths} from "../../src/setting";
import {UserCreateModel} from "../../src/types/users/input";
import {UserOutputType} from "../../src/types/users/output";
import {usersTestManager} from "../utils/usersTestManager";
import {blogTestManager} from "../utils/blogTestManager";
import {OutputItemsBlogType} from "../../src/types/blogs/output";
import {BlogCreateModel} from "../../src/types/blogs/input";
import {OutputItemsPostType} from "../../src/types/posts/output";
import {PostToBlogCreateModel} from "../../src/types/posts/input";
import {CommentCreateModel} from "../../src/types/comment/input";
import {OutputItemsCommentType} from "../../src/types/comment/output";
import {commentTestManager} from "../utils/commentTestManager";



describe('/comments', () => {
    //Очищаем БД
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
    let tokenForUser1: string;
    let user1: UserOutputType;
    //Cоздаем пользователя
    it("should create user with correct input data ", async () => {
        const createResponse = await usersTestManager.createUser(userData, basicAuth, 201);
        user1 = createResponse.body;
        //Получаем токен для авторизации
        tokenForUser1 = await usersTestManager.getToken({loginOrEmail : userData.login,password: userData.password})
    });
    //Данные для создания блога и поста
    const blogData: BlogCreateModel = {
        "name": "Test",
        "description": "TestTest",
        "websiteUrl": "https://PPz5AHN4233pPT.tnjkvAyt0eTgYIMDH1Ta2c8P4D4S.nZks7ETTTvj_C0KlfFervklQChq0MRpO.rPZqN.nUfBwdsoz"
    };
    const postData: PostToBlogCreateModel = {
        title: "PostToBLogTest",
        shortDescription: "PostToBLogTestPostToBLogTest",
        content: "PostToBLogTestPostToBLogTestPostToBLogTestPostToBLogTest",
    };
    //данные созданых блогов и постов
    let blog1: OutputItemsBlogType;
    let post1: OutputItemsPostType;
    //Создаем блог и пост
    it("should create blog and post in him", async () => {
        blog1 = (await blogTestManager.createBlog(blogData, 201)).body;
        post1 = (await blogTestManager.createPostInBlog(blog1.id, postData, 201)).body;
    });
    //Создаем коменетарий
    const commentData: CommentCreateModel = {
        "content": "длиннаэтойстрокиравна23"
    };
    const wrongCommentData: CommentCreateModel = {
        "content": "1"
    };
    let comment1:OutputItemsCommentType;

    it("should create comment in post", async () => {
        await request(app)
            .post(`${RouterPaths.posts}/${post1.id}/comments`)
            .set('Authorization', `Bearer ${tokenForUser1}`)
            .send(commentData)
            .expect(201)
            .then(response => {
                comment1 = response.body;
                expect(response.body).toEqual({
                    "id": expect.any(String),
                    "content": commentData.content,
                    "commentatorInfo": {
                        "userId": user1.id,
                        "userLogin": user1.login
                    },
                    "createdAt": expect.any(String)
                })
            })
    });
    //Пытаемя создать коменнтарий с неправильной длинной
    it("should'nt create comment in post", async () => {
        await request(app)
            .post(`${RouterPaths.posts}/${post1.id}/comments`)
            .set('Authorization', `Bearer ${tokenForUser1}`)
            .send(wrongCommentData)
            .expect(400,{
                "errorsMessages": [
                    {
                        "message": "Incorrect content",
                        "field": "content"
                    }
                ]
            })
    });

    //Пытаемся создать коментарий с неправильным токеном
    it("should'nt create comment in post", async () => {
        await request(app)
            .post(`${RouterPaths.posts}/${post1.id}/comments`)
            .set('Authorization', `Bearer 657c3c905fb6928e9f717220`)
            .send(wrongCommentData)
            .expect(401)

    });
    //Пытаемся создать коментарий с к несуществующему посту
    it("should'nt create comment in post", async () => {
        await request(app)
            .post(`${RouterPaths.posts}/157c3ce814e3d78100d0296b/comments`)
            .set('Authorization', `Bearer ${tokenForUser1}`)
            .send(commentData)
            .expect(404)
    });

    //Создаем еще 4 коменнтария
    let comment2: OutputItemsCommentType;
    let comment3: OutputItemsCommentType;
    let comment4: OutputItemsCommentType;
    let comment5: OutputItemsCommentType;
    it("should create 4 comment in post", async () => {
        comment2 = await commentTestManager.createComment(commentData, post1.id, tokenForUser1);
        comment3 = await commentTestManager.createComment(commentData, post1.id, tokenForUser1);
        comment4 = await commentTestManager.createComment(commentData, post1.id, tokenForUser1);
        comment5 = await commentTestManager.createComment(commentData, post1.id, tokenForUser1);
        // Проверяем что созданные айди у комментариев разные
        expect(comment1.id).not.toEqual(comment2.id);
        expect(comment2.id).not.toEqual(comment3.id);
        expect(comment3.id).not.toEqual(comment4.id);
        expect(comment4.id).not.toEqual(comment1.id);
    });
    ///////////////////////////////////
    /* Проверяем query запросы !!!🥲 */
    ///////////////////////////////////
    //Проверяем наличие 5 комментов к посту с сортировкой по умлочанию
    it("should return 5 comments from post ", async () => {
        await request(app)
            .get(`${RouterPaths.posts}/${post1.id}/comments`)
            .expect(200, {
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 5,
                "items": [comment5, comment4, comment3, comment2, comment1]
            })
    });
    //Проверяем наличие 5 5 комментов к посту с сортировкой asc
    it("should return 5 users for createdBlog ", async () => {
        await request(app)
            .get(`${RouterPaths.posts}/${post1.id}/comments/?sortDirection=asc`)
            .expect(200, {
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 5,
                "items": [comment1, comment2, comment3, comment4, comment5]
            })
    });
    //Проверяем pageSize = 1 | asc
    it("should return 1 user for createdBlog ", async () => {
        await request(app)
            .get(`${RouterPaths.posts}/${post1.id}/comments/?sortDirection=asc&pageSize=1`)
            .expect(200, {
                pagesCount: 5,
                page: 1,
                pageSize: 1,
                totalCount: 5,
                items: [comment1]
            })
    });
    //Проверяем pageSize = 1 | desc
    it("should return 5 posts for createdBlog ", async () => {
        await request(app)
            .get(`${RouterPaths.posts}/${post1.id}/comments/?pageSize=1`)
            .expect(200, {
                pagesCount: 5,
                page: 1,
                pageSize: 1,
                totalCount: 5,
                items: [comment5]
            })
    });
    //Проверяем pageSize = 1 и pageNumber 2 | desc
    it("should return 1 user for createdBlog ", async () => {
        await request(app)
            .get(`${RouterPaths.posts}/${post1.id}/comments/?pageSize=1&pageNumber=2`)
            .expect(200, {
                pagesCount: 5,
                page: 2,
                pageSize: 1,
                totalCount: 5,
                items: [comment4]
            })
    });

    ///////////////////////////
    ///Конец проверки query///
    //////////////////////////

    //Проверяем обновление комментария
    it("should update comment1 ", async () => {
        await request(app)
            .put(`${RouterPaths.comments}/${comment1.id}`)
            .set('Authorization', `Bearer ${tokenForUser1}`)
            .send({
                content: "stringstringstringst"
            })
            .expect(204)
    });
    //Не должен обновится с неправильной датой
    it("should'nt update comment1 with incorrect data length ", async () => {
        await request(app)
            .put(`${RouterPaths.comments}/${comment1.id}`)
            .set('Authorization', `Bearer ${tokenForUser1}`)
            .send({
                content: "lox"
            })
            .expect(400)
    });
    //Не должен обновится с неправильным токентом
    it("should'nt update comment1 with incorrect token ", async () => {
        await request(app)
            .put(`${RouterPaths.comments}/${comment1.id}`)
            .set('Authorization', `Bearer 657c44b5349f201078ed0766`)
            .send({
                content: "lox"
            })
            .expect(401)
    });

    //Создаем второго юзера для генерации второго токена
    //Данные созданного пользователя2
    const userData2: UserCreateModel = {
        "login": "qqTSsPPMf",
        "password": "string1",
        "email": "1linsegreen@mail.ru"
    };
    let tokenForUser2: string;
    let user2: UserOutputType;
    //Cоздаем пользователя
    it("should create user with correct input data ", async () => {
        const createResponse = await usersTestManager.createUser(userData2, basicAuth, 201);
        user2 = createResponse.body;
        //Получаем токен для авторизации
        tokenForUser2 = await usersTestManager.getToken({loginOrEmail: userData2.login, password: userData2.password})
    });

    //Не должен обновится с чужим токеном
    it("should'nt update comment1 with incorrect token ", async () => {
        await request(app)
            .put(`${RouterPaths.comments}/${comment1.id}`)
            .set('Authorization', `Bearer ${tokenForUser2}`)
            .send({
                content: "324243234423234234234234234"
            })
            .expect(403)
    });
    //Получаем комментарий по id
    it("should return comment 5 ", async () => {
        await request(app)
            .get(`${RouterPaths.comments}/${comment5.id}`)
            .expect(200, comment5)
    });
    //Удаляем комментарий
    it("should delete comment 5 ", async () => {
        await request(app)
            .delete(`${RouterPaths.comments}/${comment5.id}`)
            .set('Authorization', `Bearer ${tokenForUser1}`)
            .expect(204)
    });
    //пытаемся получить удаленный комментарий
    it("shouldn't return comment", async () => {
        await request(app)
            .get(`${RouterPaths.comments}/${comment5.id}`)
            .expect(404)
    });
    //Пытаемся удалить комментарий с неправильным токеном
    it("shouldn't delete comment 4 ", async () => {
        await request(app)
            .delete(`${RouterPaths.comments}/${comment4.id}`)
            .set('Authorization', `Bearer ${tokenForUser2}`)
            .expect(403)
    });
    //Пытаемся удалить комментарий с неправильным токеном
    it("shouldn't delete comment 4 ", async () => {
        await request(app)
            .delete(`${RouterPaths.comments}/${comment4.id}`)
            .set('Authorization', `Bearer 657c486336906bff0bc5c950`)
            .expect(401)
    });
    //Проверяем что комментарий 4 на месте
    it("should return comment 4 ", async () => {
        await request(app)
            .get(`${RouterPaths.comments}/${comment4.id}`)
            .expect(200, comment4)
    });
    //Пытаемся удалить удаленный комментарий
    it("shouldn't delete comment 5 ", async () => {
        await request(app)
            .delete(`${RouterPaths.comments}/${comment5.id}`)
            .set('Authorization', `Bearer ${tokenForUser1}`)
            .expect(404)
    });
});