// noinspection AnonymousFunctionJS,MagicNumberJS,LocalVariableNamingConventionJS,FunctionTooLongJS

import request from 'supertest'
import {BlogCreateModel} from "../../src/types/blogs/input";
import {OutputItemsBlogType} from "../../src/types/blogs/output";
import {blogTestManager} from "../utils/blogTestManager";
import {app, RouterPaths} from "../../src/setting";
import {PostToBlogCreateModel} from "../../src/types/posts/input";
import {PostType} from "../../src/types/posts/output";


describe('/blogs', () => {
    // Очищаем БД
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
    });

    const basicPag = {
        "pagesCount": 0,
        "page": 1,
        "pageSize": 10,
        "totalCount": 0,
        "items": []
    };

    // Проверяем что БД пустая
    it('should return 200 and empty []', async () => {
        await request(app)
            .get(RouterPaths.blogs)
            .expect(200, basicPag)
    });

    //Переменные для хранения данных созданных блогов
    let createdBlog: OutputItemsBlogType;
    let secondCreatedBlog: OutputItemsBlogType;


    const blogData: BlogCreateModel = {
        "name": "Felix",
        "description": "Secret",
        "websiteUrl": "https://iaWvPbi4nnt1cAej2P1InTA.XtfqLdbJEXn29s9xpDzU762y._qXDYoZFu-TSCTCLhfR.RyF-B3dMemIrQ.INbBcnB3u"
    };

    const wrongBlogData: BlogCreateModel = {
        "name": "SecretSecretSecretSecretSecretSecretSecretSecretSecretSecretSecret",
        "description": "",
        "websiteUrl": "htt://iaWvPbi4nnt1cAej2P1InTA.XtfqLdbJEXn29s9xpDzU762y._qXDYoZFu-TSCTCLhfR.RyF-B3dMemIrQ.INbBcnB3u"
    };


    // Пытаемся создать блог с неправильными данными
    it("should'nt create blogs with incorrect input data ", async () => {

        //Отсылаем неправильнные данные
        const createResponse = await blogTestManager.createBlog(wrongBlogData, 400);

        // Проверяем сообщение об ошибке
        const errorsMessage = createResponse.body;
        expect(errorsMessage).toEqual({
            errorsMessages: [
                {message: 'Incorrect websiteUrl', field: 'websiteUrl'},
                {message: 'Incorrect description', field: 'description'},
                {message: 'Incorrect name', field: 'name'}
            ]
        })

    });

    //Не проходим проверку логина и пароля
    it("should'nt create blogs without login and pass ", async () => {
        await request(app)
            .post(RouterPaths.blogs)
            .auth('aaaa', 'qwert')
            .expect(401, "Unauthorized")
    });


    // Создаем блог
    it("should CREATE blogs with correct input data ", async () => {
        const createResponse = await blogTestManager.createBlog(blogData, 201);
        //Проверяем что созданный блог соответствует заданным параметрам
        createdBlog = createResponse.body;
        expect(createdBlog).toEqual({
            "id": expect.any(String),
            "name": "Felix",
            "description": "Secret",
            "websiteUrl": "https://iaWvPbi4nnt1cAej2P1InTA.XtfqLdbJEXn29s9xpDzU762y._qXDYoZFu-TSCTCLhfR.RyF-B3dMemIrQ.INbBcnB3u",
            "createdAt": expect.any(String),
            "isMembership": false
        });

        //Проверяем что создался только один блог
        await request(app)
            .get(RouterPaths.blogs)
            .expect(200, {
                ...basicPag,
                pagesCount: 1,
                totalCount: 1,
                items: [createdBlog]
            })
    });

    // Создаем второй блог
    it("should CREATE blogs with correct input data ", async () => {
        const createResponse = await blogTestManager.createBlog(blogData, 201);

        //Проверяем что созданный блог соответствует заданным параметрам
        secondCreatedBlog = createResponse.body;
        expect(secondCreatedBlog).toEqual({
            "id": expect.any(String),
            "name": "Felix",
            "description": "Secret",
            "websiteUrl": "https://iaWvPbi4nnt1cAej2P1InTA.XtfqLdbJEXn29s9xpDzU762y._qXDYoZFu-TSCTCLhfR.RyF-B3dMemIrQ.INbBcnB3u",
            "createdAt": expect.any(String),
            "isMembership": false
        });

        // Проверяем что созданные айди у двух блогов разные
        expect(createdBlog.id).not.toEqual(secondCreatedBlog.id);

        //Проверяем что в бд теперь два блога
        await request(app)
            .get(RouterPaths.blogs)
            .expect(200, {
                ...basicPag,
                pagesCount: 1,
                totalCount: 2,
                items: [secondCreatedBlog, createdBlog]
            })
    });

    //Пытаемся обновить createdBlog c неправильными данными
    it("should'nt UPDATE video with incorrect input data ", async () => {
        await request(app)
            .put(`${RouterPaths.blogs}/${encodeURIComponent(createdBlog.id)}`)
            .auth('admin', 'qwerty')
            .send(wrongBlogData)
            .expect(400, {
                errorsMessages: [
                    {message: 'Incorrect websiteUrl', field: 'websiteUrl'},
                    {message: 'Incorrect description', field: 'description'},
                    {message: 'Incorrect name', field: 'name'}
                ]
            });

        // Попытка обновить без логина и пароля
        await request(app)
            .put(`${RouterPaths.blogs}/${encodeURIComponent(createdBlog.id)}`)
            .auth('adminn', 'qwertn')
            .send(wrongBlogData)
            .expect(401, 'Unauthorized');

        // Проверяем что блог не изменился
        await request(app)
            .get(`${RouterPaths.blogs}/${encodeURIComponent(createdBlog.id)}`)
            .expect(200, createdBlog)
    });

    // Обновляем данные createdBlog
    it("should UPDATE blogs with correct input data ", async () => {
        await request(app)
            .put(`${RouterPaths.blogs}/${encodeURIComponent(createdBlog.id)}`)
            .auth('admin', 'qwerty')
            .send(blogData)
            .expect(204);

        // Проверяем что первый блог изменилсяЗФ
        await request(app)
            .get(`${RouterPaths.blogs}/${encodeURIComponent(createdBlog.id)}`)
            .expect(200, {
                ...createdBlog,
                ...blogData
            });

        // Проверяем что второй блог не изменился
        await request(app)
            .get(`${RouterPaths.blogs}/${encodeURIComponent(secondCreatedBlog.id)}`)
            .expect(200, secondCreatedBlog);

        // Обновляем запись с первым блогом
        createdBlog = {
            ...createdBlog,
            ...blogData
        }
    });

    const postData: PostToBlogCreateModel = {
        title: "PostToBLogTest",
        shortDescription: "PostToBLogTestPostToBLogTest",
        content: "PostToBLogTestPostToBLogTestPostToBLogTestPostToBLogTest",
    };
    const wrongPostData: PostToBlogCreateModel = {
        title: "",
        shortDescription: "",
        content: "",
    };

    let postInBlog: PostType;

    //Пытаемся создать пост ( с неправильными данными) в блоге
    it("should create new post for specific blog", async () => {
        await request(app)
            .post(`${RouterPaths.blogs}/${encodeURIComponent(createdBlog.id)}${RouterPaths.posts}`)
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
                    }
                ]
            })
    });
    //Пытаемся создать пост ( без логина и пароля ) в блоге
    it("should create new post for specific blog", async () => {
        await request(app)
            .post(`${RouterPaths.blogs}/${encodeURIComponent(createdBlog.id)}${RouterPaths.posts}`)
            .auth('adminn', 'qwertyy')
            .send(wrongPostData)
            .expect(401, 'Unauthorized')
    });

    // Cоздаем пост в конкретном блоге
    it("should create new post for specific blog", async () => {
        await request(app)
            .post(`${RouterPaths.blogs}/${encodeURIComponent(createdBlog.id)}${RouterPaths.posts}`)
            .auth('admin', 'qwerty')
            .send(postData)
            .expect(201)
            .then(response => {
                postInBlog = response.body;
                expect(response.body).toEqual({
                    ...postData,
                    id: expect.any(String),
                    blogId: createdBlog.id,
                    blogName: createdBlog.name,
                    createdAt: expect.any(String)
                })
            })
    });

    //Проверяем что создался пост в блоге createdBlog
    it("should return 1 post in createdBlog", async () => {
        await request(app)
            .get(`${RouterPaths.blogs}/${encodeURIComponent(createdBlog.id)}${RouterPaths.posts}`)
            .expect(200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [postInBlog]
            })
    });

    //Пытаемся создать пост с неправильным ID блога
    it("should create new post for specific blog", async () => {
        await request(app)
            .post(`${RouterPaths.blogs}/${encodeURIComponent(123)}${RouterPaths.posts}`)
            .auth('admin', 'qwerty')
            .send(postData)
            .expect(400, {"errorsMessages":[{"message":"id NOT mongoID","field":"id"}]})
    });

    ///////////////////////////////////
    /* Проверяем query запросы !!!🥲 */
    ///////////////////////////////////

    //Проверка для запроса по всем блогам//
    let blog3: OutputItemsBlogType;
    let blog4: OutputItemsBlogType;
    let blog5: OutputItemsBlogType;
    let blog6: OutputItemsBlogType;
    let blog7: OutputItemsBlogType;
    // Создаем блог3, блог4, блог5, блог6, блог7
    it("should CREATE  5 blogs with correct input data ", async () => {
        blog3 = (await blogTestManager.createBlog(blogData, 201)).body;
        blog4 = (await blogTestManager.createBlog(blogData, 201)).body;
        blog5 = (await blogTestManager.createBlog(blogData, 201)).body;
        blog6 = (await blogTestManager.createBlog(blogData, 201)).body;
        blog7 = (await blogTestManager.createBlog(blogData, 201)).body;

        //Проверяем что в бд теперь 7 блогов с сортировкой по умолчанию
        await request(app)
            .get(RouterPaths.blogs)
            .expect(200, {
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 7,
                items: [blog7, blog6, blog5, blog4, blog3, secondCreatedBlog, createdBlog]
            })
    });

    // Проверяем сортировку asc
    it("must use sort asc ", async () => {
        await request(app)
            .get(`${RouterPaths.blogs}?sortDirection=asc`)
            .expect(200, {
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 7,
                items: [createdBlog, secondCreatedBlog, blog3, blog4, blog5, blog6, blog7]
            })
    });

    // Проверяем фильтр по имени, c cортировкой asc
    it("must use sort asc ", async () => {
        await request(app)
            .get(`${RouterPaths.blogs}?searchNameTerm=ix&sortDirection=asc`)
            .expect(200, {
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 7,
                items: [createdBlog, secondCreatedBlog, blog3, blog4, blog5, blog6, blog7]
            });

        //Поиск по несущестующему имени
        await request(app)
            .get(`${RouterPaths.blogs}?searchNameTerm=lox&sortDirection=asc`)
            .expect(200, {
                "pagesCount": 0,
                "page": 1,
                "pageSize": 10,
                "totalCount": 0,
                "items": []
            })
    });

    //Проверяем сортировку по другим полям
    it("must use sort by ID (desc)", async () => {
        await request(app)
            .get(`${RouterPaths.blogs}?sortBy=_id`)
            .expect(200, {
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 7,
                items: [blog7, blog6, blog5, blog4, blog3, secondCreatedBlog, createdBlog]

            })
    });
    it("must use sort by ID (asc)", async () => {
        await request(app)
            .get(`${RouterPaths.blogs}?sortBy=_id&sortDirection=asc`)
            .expect(200, {
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 7,
                items: [createdBlog, secondCreatedBlog, blog3, blog4, blog5, blog6, blog7]
            })
    });
    // Проверяем pageSize
    it("must return  pageSize * object in response.body ", async () => {
        //pageSize = 1
        await request(app)
            .get(`${RouterPaths.blogs}?pageSize=1`)
            .expect(200, {
                "pagesCount": 7,
                "page": 1,
                "pageSize": 1,
                "totalCount": 7,
                "items": [blog7]
            });

        //pageSize = 2
        await request(app)
            .get(`${RouterPaths.blogs}?pageSize=2`)
            .expect(200, {
                "pagesCount": 4,
                "page": 1,
                "pageSize": 2,
                "totalCount": 7,
                "items": [blog7, blog6]
            })
    });
    // Проверяем pageNumber
    it("must return  1 object on second page ", async () => {
        await request(app)
            .get(`${RouterPaths.blogs}?pageNumber=2&pageSize=1`)
            .expect(200, {
                "pagesCount": 7,
                "page": 2,
                "pageSize": 1,
                "totalCount": 7,
                "items": [blog6]
            })
    });
    it("must return  1 object on page number 3 ", async () => {
        await request(app)
            .get(`${RouterPaths.blogs}?pageNumber=4&pageSize=2`)
            .expect(200, {
                "pagesCount": 4,
                "page": 4,
                "pageSize": 2,
                "totalCount": 7,
                "items": [createdBlog]
            })
    });

    //Проверяем создание постов для конкретного блога//
    let post2: PostType;
    let post3: PostType;
    let post4: PostType;
    let post5: PostType;
    //Создаем еще 4 поста в блоге ( всего их теперь 5)
    it("should CREATE post in blog ", async () => {
        post2 = (await blogTestManager.createPostInBlog(createdBlog.id, postData, 201)).body;
        post3 = (await blogTestManager.createPostInBlog(createdBlog.id, postData, 201)).body;
        post4 = (await blogTestManager.createPostInBlog(createdBlog.id, postData, 201)).body;
        post5 = (await blogTestManager.createPostInBlog(createdBlog.id, postData, 201)).body;
    });

    it("should return 5 posts for createdBlog ", async () => {
        await request(app)
            .get(`${RouterPaths.blogs}/${encodeURIComponent(createdBlog.id)}${RouterPaths.posts}`)
            .expect(200, {
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 5,
                "items": [post5, post4, post3, post2, postInBlog]
            })
    });
    //Проверяем pageSize = 2
    it("should return 2 on first page ", async () => {
        await request(app)
            .get(`${RouterPaths.blogs}/${encodeURIComponent(createdBlog.id)}${RouterPaths.posts}/?pageSize=2`)
            .expect(200, {
                "pagesCount": 3,
                "page": 1,
                "pageSize": 2,
                "totalCount": 5,
                "items": [post5, post4]
            })
    });
    //Проверяем pageSize = 3
    it("should return 3 on first page ", async () => {
        await request(app)
            .get(`${RouterPaths.blogs}/${encodeURIComponent(createdBlog.id)}${RouterPaths.posts}/?pageSize=3`)
            .expect(200, {
                "pagesCount": 2,
                "page": 1,
                "pageSize": 3,
                "totalCount": 5,
                "items": [post5, post4, post3]
            })
    });
    //Проверяем pageSize = 2 и сортировку asc
    it("should return 3 on first page ", async () => {
        await request(app)
            .get(`${RouterPaths.blogs}/${encodeURIComponent(createdBlog.id)}${RouterPaths.posts}/?pageSize=3&sortDirection=asc`)
            .expect(200, {
                "pagesCount": 2,
                "page": 1,
                "pageSize": 3,
                "totalCount": 5,
                "items": [postInBlog, post2, post3]
            })
    });
    //Проверяем pageSize = 3 и sortBy _id
    it("should return 3 on first page ", async () => {
        await request(app)
            .get(`${RouterPaths.blogs}/${encodeURIComponent(createdBlog.id)}${RouterPaths.posts}/?pageSize=3&sortBy=_id`)
            .expect(200, {
                "pagesCount": 2,
                "page": 1,
                "pageSize": 3,
                "totalCount": 5,
                "items": [post5, post4, post3]
            })
    });
    //Проверяем pageSize = 3 и sortBy _id ASC
    it("should return 3 on first page ", async () => {
        await request(app)
            .get(`${RouterPaths.blogs}/${encodeURIComponent(createdBlog.id)}${RouterPaths.posts}/?pageSize=3&sortDirection=asc&sortBy=_id`)
            .expect(200, {
                "pagesCount": 2,
                "page": 1,
                "pageSize": 3,
                "totalCount": 5,
                "items": [postInBlog, post2, post3]
            })
    });

    ///////////////////////////
    ///Конец проверки query///
    //////////////////////////

    // Удаляем createdBlog
    it("should DELETE blogs with correct id ", async () => {
        await request(app)
            .delete(`${RouterPaths.blogs}/${encodeURIComponent(createdBlog.id)}`)
            .auth('admin', 'qwerty')
            .expect(204);
    });

    //Проверяем что в бд теперь 6 блогов с сортировкой по умолчанию
    it("should return 6 blogs ", async () => {
        await request(app)
            .get(RouterPaths.blogs)
            .expect(200, {
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 6,
                items: [blog7, blog6, blog5, blog4, blog3, secondCreatedBlog]
            })
    });

    // Удаляем secondCreatedBlog блог
    it("should DELETE second blog with correct input data ", async () => {
        await request(app)
            .delete(`${RouterPaths.blogs}/${encodeURIComponent(secondCreatedBlog.id)}`)
            .auth('admin', 'qwerty')
            .expect(204)
    });

    //Проверяем что в бд теперь 5 блогов с сортировкой по умолчанию
    it("should return 5 blogs ", async () => {
        await request(app)
            .get(RouterPaths.blogs)
            .expect(200, {
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 5,
                items: [blog7, blog6, blog5, blog4, blog3]
            })
    });
});


