// noinspection AnonymousFunctionJS,MagicNumberJS,LocalVariableNamingConventionJS

import request from "supertest";
import {PostCreateModel, PostToBlogCreateModel} from "../../src/types/posts/input";
import {OutputItemsPostType} from "../../src/types/posts/output";
import {BlogCreateModel} from "../../src/types/blogs/input";
import {blogTestManager} from "../utils/blogTestManager";
import {app, RouterPaths} from "../../src/setting";


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
                .get(RouterPaths.posts)
                .expect(200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
        });


        const wrongPostData: PostCreateModel = {
            title: "",
            shortDescription: "",
            content: "",
            blogId: ""
        };

        // Переменная для хранения информации для создания поста
        let postData: PostCreateModel;
        //для хранения id blog
        let blogId: string;

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
        // данные для создания блога
        const blogCreateData: BlogCreateModel = {
            name: "TestingPosts",
            description: "WhaitID",
            websiteUrl: "https://iaWvPbi4nnt1cAej2P1InTA.XtfqLdbJEXn29s9xpDzU762y._qXDYoZFu-TSCTCLhfR.RyF-B3dMemIrQ.INbBcnB3u"
        };

        // Создаем пост
        it("should CREATE post with correct input data 1", async () => {

            // cоздаем блог, так как без него пост создать нельзя
            const blogData = (await blogTestManager.createBlog(blogCreateData, 201)).body;
            blogId = blogData.id;

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
                    expect(response.body).toEqual({
                        "pagesCount": 1,
                        "page": 1,
                        "pageSize": 10,
                        "totalCount": 1,
                        "items": [createdPostData]
                    })
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
                    expect(response.body).toEqual({
                        "pagesCount": 1,
                        "page": 1,
                        "pageSize": 10,
                        "totalCount": 2,
                        "items": [secondCreatedPost, createdPostData]
                    })

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
                .expect({
                    "pagesCount": 1,
                    "page": 1,
                    "pageSize": 10,
                    "totalCount": 1,
                    "items": [secondCreatedPost]
                })

        });

        // Удаляем второй пост
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
                .expect(200, {
                    "pagesCount": 0,
                    "page": 1,
                    "pageSize": 10,
                    "totalCount": 0,
                    "items": []
                })
        });


        ///////////////////////////////////
        /* Проверяем query запросы !!!🥲 */
        ///////////////////////////////////

        //Проверка для запроса по всем постам
        let post1: OutputItemsPostType;
        let post2: OutputItemsPostType;
        let post3: OutputItemsPostType;
        let post4: OutputItemsPostType;
        let post5: OutputItemsPostType;

        const postDataNoID: PostToBlogCreateModel = {
            title: "PostToBLogTest",
            shortDescription: "PostToBLogTestPostToBLogTest",
            content: "PostToBLogTestPostToBLogTestPostToBLogTestPostToBLogTest",
        };


        // Создаем 5 постов
        it("should CREATE  5 posts with correct input data ", async () => {
            //Создаем блог для постов

            post1 = (await blogTestManager.createPostInBlog(blogId, postDataNoID, 201)).body;
            post2 = (await blogTestManager.createPostInBlog(blogId, postDataNoID, 201)).body;
            post3 = (await blogTestManager.createPostInBlog(blogId, postDataNoID, 201)).body;
            post4 = (await blogTestManager.createPostInBlog(blogId, postDataNoID, 201)).body;
            post5 = (await blogTestManager.createPostInBlog(blogId, postDataNoID, 201)).body;

        });

        //Проверяем наличие 5 постов в блоке с сортировкой по умлочанию
        it("should return 5 posts for createdBlog ", async () => {
            await request(app)
                .get(`${RouterPaths.blogs}/${encodeURIComponent(blogId)}${RouterPaths.posts}`)
                .expect(200, {
                    "pagesCount": 1,
                    "page": 1,
                    "pageSize": 10,
                    "totalCount": 5,
                    "items": [post5, post4, post3, post2, post1]
                })
        });
        //Проверяем наличие 5 постов в блоке с сортировкой asc
        it("should return 5 posts for createdBlog ", async () => {
            await request(app)
                .get(`${RouterPaths.blogs}/${encodeURIComponent(blogId)}${RouterPaths.posts}/?sortDirection=asc`)
                .expect(200, {
                    "pagesCount": 1,
                    "page": 1,
                    "pageSize": 10,
                    "totalCount": 5,
                    "items": [post1, post2, post3, post4, post5]
                })
        });
        //Проверяем pageSize = 1 | asc
        it("should return 1 user for createdBlog ", async () => {
            await request(app)
                .get(`${RouterPaths.blogs}/${encodeURIComponent(blogId)}${RouterPaths.posts}/?sortDirection=asc&pageSize=1`)
                .expect(200, {
                    pagesCount: 5,
                    page: 1,
                    pageSize: 1,
                    totalCount: 5,
                    items: [post1]
                })
        });
        //Проверяем pageSize = 1 | desc
        it("should return 1 posts for createdBlog ", async () => {
            await request(app)
                .get(`${RouterPaths.blogs}/${encodeURIComponent(blogId)}${RouterPaths.posts}/?pageSize=1`)
                .expect(200, {
                    pagesCount: 5,
                    page: 1,
                    pageSize: 1,
                    totalCount: 5,
                    items: [post5]
                })
        });

        //Проверяем pageSize = 1 и pageNumber 2 | desc
        it("should return 1 posts for createdBlog ", async () => {
            await request(app)
                .get(`${RouterPaths.blogs}/${encodeURIComponent(blogId)}${RouterPaths.posts}/?pageSize=1&pageNumber=2`)
                .expect(200, {
                    pagesCount: 5,
                    page: 2,
                    pageSize: 1,
                    totalCount: 5,
                    items: [post4]
                })
        });
    });