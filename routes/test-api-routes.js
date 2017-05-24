module.exports = function(app) {
    app.get("/test/person", function (req, res) {
        var mockObject =
            [{
                id: 1,
                first_name: "Angel",
                last_name: "Adams",
                email: "test@test.com",
                password: "password",
                dob: "1980-01-25"
            },
                {
                    id: 2,
                    first_name: "Bob",
                    last_name: "Barnes",
                    email: "test2@test2.com",
                    password: "password2",
                    dob: "2002-02-25",
                }];
        res.render('create', mockObject)
    });

    app.get("/test/family", function (req, res) {
        var mockObject =
            [{
                id: 1,
                name: "Adams Family",
                secret_key: "secret one",
                PersonId: 1
            },
                {
                    id: 2,
                    name: "AdamsInLawsName",
                    secret_key: "secret two",
                    PersonId: 1
                },
                {
                    id: 3,
                    name: "Barnes Family",
                    secret_key: "secret three",
                    PersonId: 2
                },
                {
                    id: 4,
                    name: "BarnesInLawsName",
                    secret_key: "secret four",
                    PersonId: 2
                }];
        res.render('create', mockObject)
    });

    app.get("/test/personfamily", function (req, res) {
        var mockObject =
            [{
                id: 1,
                PersonId: 1,
                FamilyId: 1
            },
                {
                    id: 2,
                    PersonId: 1,
                    FamilyId: 2
                },
                {
                    id: 3,
                    PersonId: 2,
                    FamilyId: 3
                },
                {
                    id: 4,
                    PersonId: 2,
                    FamilyId: 4
                }];
        res.render('create', mockObject)
    });

    app.get("/test/chatroom", function (req, res) {
        var mockObject =
            [{
                id: 1,
                name: "Room One for Adams",
                PersonId: 1,
                FamilyId: 1
            },
                {
                    id: 2,
                    name: "Room Two for Adams",
                    PersonId: 1,
                    FamilyId: 1
                },
                {
                    id: 3,
                    name: "Room One for P2 F3",
                    PersonId: 2,
                    FamilyId: 3
                },
                {
                    id: 4,
                    name: "Room Two for P2 F3",
                    PersonId: 2,
                    FamilyId: 3
                }];
        res.render('create', mockObject)
    });

    app.get("/test/chatpost", function (req, res) {
        var mockObject = [{
            id: 1,
            name: "Chatpost P1 F1 One - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed justo tellus. Sed dictum mattis purus ultrices bibendum. Sed eget viverra purus. Sed vitae aliquam tortor. Pellentesque eget odio vitae lacus euismod suscipit et non odio. Aliquam quis erat enim. Duis finibus rhoncus lacus et sollicitudin. Nam tincidunt dictum maximus. Nullam egestas dolor diam, iaculis malesuada eros vulputate in. Vivamus viverra dictum ligula in consequat. Maecenas ex enim, aliquet sit amet neque quis, lacinia faucibus ipsum.",
            PersonId: 1,
            FamilyId: 1
        },
            {
                id: 2,
                name: "Chatpost P1 F2 Two - Etiam egestas lacus vitae erat sodales, sit amet ultrices sem bibendum. Quisque lobortis enim eu nisi bibendum accumsan. Ut nec ligula at sapien hendrerit accumsan id ut metus. Morbi a arcu arcu. Phasellus a ligula at diam semper lacinia ut eu purus. Curabitur fermentum, justo non rutrum lobortis, nulla orci rutrum est, id luctus neque leo quis felis. Nulla facilisi.",
                PersonId: 1,
                FamilyId: 2
            },
            {
                id: 3,
                name: "Chatpost P2 F3 One - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed justo tellus. Sed dictum mattis purus ultrices bibendum. Sed eget viverra purus. Sed vitae aliquam tortor. Pellentesque eget odio vitae lacus euismod suscipit et non odio. Aliquam quis erat enim. Duis finibus rhoncus lacus et sollicitudin. Nam tincidunt dictum maximus. Nullam egestas dolor diam, iaculis malesuada eros vulputate in. Vivamus viverra dictum ligula in consequat. Maecenas ex enim, aliquet sit amet neque quis, lacinia faucibus ipsum.",
                PersonId: 2,
                FamilyId: 3
            },
            {
                id: 4,
                name: "Chatpost P2 F3 Two - Etiam egestas lacus vitae erat sodales, sit amet ultrices sem bibendum. Quisque lobortis enim eu nisi bibendum accumsan. Ut nec ligula at sapien hendrerit accumsan id ut metus. Morbi a arcu arcu. Phasellus a ligula at diam semper lacinia ut eu purus. Curabitur fermentum, justo non rutrum lobortis, nulla orci rutrum est, id luctus neque leo quis felis. Nulla facilisi.",
                PersonId: 2,
                FamilyId: 3
            }];
        res.render('create', mockObject)
    });
};