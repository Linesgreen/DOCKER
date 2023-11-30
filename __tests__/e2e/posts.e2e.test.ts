// noinspection AnonymousFunctionJS,MagicNumberJS

import request from "supertest";
import {PostCreateModel} from "../../src/types/posts/input";
import {OutputItemsPostType} from "../../src/types/posts/output";
import {BlogCreateModel} from "../../src/types/blogs/input";
import {blogTestManager} from "../utils/blogTestManager";
import {app, RouterPaths} from "../../src/setting";

describe('/posts', () => {

    // Очищаем БД
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
    });

    // Проверяем что БД пустая
    it('should return 200 and empty []', async () => {
        await request(app)
            .get(RouterPaths.posts)
            .expect(200, [])
    });


    const wrongPostData: PostCreateModel = {
        title: "",
        shortDescription: "",
        content: "",
        blogId: ""
    };

    // Переменная для хранения информации для создания поста
    let postData: PostCreateModel;


    // Пытаемся создать пост с неправильными данными
    it("should'nt create post with incorrect input data ", async () => {
        //Отсылаем неправильнные данные
        await request(app)
            .post(RouterPaths.posts)
            .auth('admin', 'qwerty')
            .send(wrongPostData)
            .expect(400, {
                "errorsMessages": [
                    {
                        "message": "Incorrect title",
                        "field": "title"
                    },
                    {
                        "message": "Incorrect shortDescription",
                        "field": "shortDescription"
                    },
                    {
                        "message": "Incorrect content",
                        "field": "content"
                    },
                    {
                        "message": "Incorrect blogId!",
                        "field": "blogId"
                    }
                ]
            })
    });

    //Не проходим проверку логина и пароля
    it("should'nt create post without login and pass ", async () => {
        await request(app)
            .post(RouterPaths.posts)
            .auth('aaaa', 'qwert')
            .expect(401, "Unauthorized")
    });


    //Переменные для хранения данных созданных постов
    let createdPostData: OutputItemsPostType;
    let secondCreatedPost: OutputItemsPostType;

    // Создаем пост
    it("should CREATE post with correct input data ", async () => {

        // данные для создания блога
        const blogCreateData: BlogCreateModel = {
            name: "TestingPosts",
            description: "WhaitID",
            websiteUrl: "https://iaWvPbi4nnt1cAej2P1InTA.XtfqLdbJEXn29s9xpDzU762y._qXDYoZFu-TSCTCLhfR.RyF-B3dMemIrQ.INbBcnB3u"
        };

        // cоздаем блог, так как без него пост создать нельзя
        const blogData = (await blogTestManager.createBlog(blogCreateData, 201)).body;


        //Заносим полученный айди Блога в создаваемый пост
        postData = {
            title: "Test",
            shortDescription: "TestTestTestTestTest",
            content: "TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest",
            blogId: blogData.id
        };

        // отыслаем данные для создания поста
        await request(app)
            .post(RouterPaths.posts)
            .auth('admin', 'qwerty')
            .send(postData)
            .expect(201)
            .then(response => {
                createdPostData = response.body;
                expect(response.body).toEqual({
                    id: expect.any(String),
                    ...postData,
                    blogName: 'TestingPosts',
                    createdAt: expect.any(String)
                })
            });


        //Проверяем что создался только один пост
        await request(app)
            .get(RouterPaths.posts)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual([createdPostData])
            })
    });

    // Создаем второй пост
    it("should CREATE post with correct input data ", async () => {
        await request(app)
            .post(RouterPaths.posts)
            .auth('admin', 'qwerty')
            .send(postData)
            .expect(201)
            .then(response => {
                secondCreatedPost = response.body;
                expect(response.body).toEqual({
                    id: expect.any(String),
                    ...postData,
                    blogName: 'TestingPosts',
                    createdAt: expect.any(String)
                })
            });

        // Проверяем что созданные айди у двух постов разные
        expect(createdPostData.id).not.toEqual(secondCreatedPost.id);

        //Проверяем что в базе находятся два поста
        await request(app)
            .get(RouterPaths.posts)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual([createdPostData, secondCreatedPost])

            })
    });


    //Пытаемся обновить первый пост с неправильными данными
    it("should'nt UPDATE post with incorrect input data ", async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${encodeURIComponent(createdPostData.id)}`)
            .auth('admin', 'qwerty')
            .send(wrongPostData)
            .expect(400, {
                errorsMessages: [
                    {message: 'Incorrect title', field: 'title'},
                    {
                        message: 'Incorrect shortDescription',
                        field: 'shortDescription'
                    },
                    {message: 'Incorrect content', field: 'content'},
                    {message: 'Incorrect blogId!', field: 'blogId'}
                ]
            });

        // Попытка обновить без логина и пароля
        await request(app)
            .put(`${RouterPaths.posts}/${encodeURIComponent(createdPostData.id)}`)
            .auth('adminn', 'qwertn')
            .send(postData)
            .expect(401, 'Unauthorized');

        // Проверяем что пост не обновился
        await request(app)
            .get(`${RouterPaths.posts}/${encodeURIComponent(createdPostData.id)}`)
            .expect(200, createdPostData)
    });


    // Обновляем данные поста
    it("should UPDATE post with correct input data ", async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${encodeURIComponent(createdPostData.id)}`)
            .auth('admin', 'qwerty')
            .send({
                ...createdPostData,
                ...postData,
                title: 'Lolik',
            })
            .expect(204);

        // Проверяем что первый пост изменился
        await request(app)
            .get(`${RouterPaths.posts}/${encodeURIComponent(createdPostData.id)}`)
            .expect(200, {
                ...createdPostData,
                ...postData,
                title: 'Lolik'
            })

    });

// Удаляем пост
    it("should DELETE blogs with correct id ", async () => {
        await request(app)
            .delete(`${RouterPaths.posts}/${encodeURIComponent(createdPostData.id)}`)
            .auth('admin', 'qwerty')
            .expect(204);

        // Проверяем что второй блог на месте а первый удалился
        await request(app)
            .get(`${RouterPaths.posts}`)
            .expect([secondCreatedPost])

    });

// Удаляем второй блог
    it("should DELETE video2 with correct input data ", async () => {
        await request(app)
            .delete(`${RouterPaths.posts}/${encodeURIComponent(secondCreatedPost.id)}`)
            .auth('admin', 'qwerty')
            .expect(204)
    });

// Проверяем что БД пустая
    it('should return 200 and empty []', async () => {
        await request(app)
            .get(RouterPaths.posts)
            .expect(200, [])
    })
});