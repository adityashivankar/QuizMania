const express = require('express');
const { users } = require('../data');
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const quizDataStudent = data.quiz;
const quizData = data.retriveQuizData;

router.get('/', async (req, res) => {
    try {
        // let getAllUsersData = await usersData.getStudentData();
        // res.json(getAllUsersData);
        let getAllUsersData = await usersData.getAllStudentUnderProfessorData(req.session.user);
        res.render('posts/users', { getAllStudentUnderProfessorResult: getAllUsersData })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/', async (req, res) => {
    try {
        let userInfo = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            universityName: req.body.universityName
        }
        let addUser = await usersData.addUserData(userInfo);
        res.json(addUser);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// router.get('/users', async (req, res) => {
//     try {
//         let getAllProfessorData = await usersData.getProfessorData();
//         res.json(getAllProfessorData);
//     } catch (e) {
//         res.status(500).json({ error: e });
//     }
// });

router.get('/logout', async (req, res) => {
    req.session.destroy();
    //res.send('Logged out!!');
    //return res.render('posts/index', {error: "You are logout now", title: "Login", notFound: false });
    res.redirect('../../login');
})

router.get('/category2', async (req, res) => {
    try {
        console.log(req.session.user);
        let quiz = await quizDataStudent.getQuiz(req.session.user,"6080a7e37c378456cbcbf278");
        res.render('posts/quiz', {title: "Quiz", quizData : quiz, quizData2 : JSON.stringify(quiz)});
    } catch (e) {
        console.log(e.err);

    }
})

router.get('/category', async (req, res) => {
    try {
        console.log(req.session.user)
        let getAllCategoryData = await usersData.getCategoryData(req.session.user, "category");
        res.render('posts/category', { categoriesResult: getAllCategoryData })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


router.post('/quiz-student-update', async (req, res) => {
    try {
        let questionId = req.body.questionId
        let selectedAns = req.body.selectedAns
        let userID = req.session.userID ? req.session.userID : "6081d5fc3dcd1dbfb511bc78";
        let quiz = await quizDataStudent.updateStudentQuiz(userID,req.body);
        res.json(quiz);
    } catch (e) {
        console.log(e.err);
    }
});

router.get('/category/:category', async (req, res) => {
    try {
        // console.log(req.params.category)
        let getSubCategoryData = await usersData.getSubCategoryOfCategory(req.session.user, req.params.category, "subCategory");
        res.render('posts/sub-category', { subCategoriesResult: getSubCategoryData })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/verifyStudent/', async (req, res) => {
    try {
        console.log(req.body.dataid);
        const updatedData = await usersData.updateStudentStatus(req.session.user, req.body.dataid);
        res.json(updatedData);
        // res.render('posts/users', { layout: null, ...updatedData })
        // let getAllReviewOfABook = await reviewsData.getAllReviews(req.params.id);

        // const newBook = await booksData.updateBook(req.params.id, booksPostData);
        // let getSubCategoryData = await usersData.getCategoryData("subCategory");
        // res.render('posts/sub-category', { subCategoriesResult: getSubCategoryData })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/category/subCategory/:subCategory', async (req, res) => {
    try {
        let getQuizData = await quizData.getStudentDataUnderProfessor(req.session.user, req.params.subCategory);
        // res.json(getQuizData);
        // let getStudentDetails = await userDataObj.getStudentRecord(getQuizData.userid);
        let getStudentDetails = await usersData.getStudentRecord(req.session.user, getQuizData);
        // console.log(getQuizData)
        // console.log(getStudentDetails)
        res.render('posts/table-list', { studentResult: getStudentDetails })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/sign-up',async (req, res)=>{
    res.render("posts/sign-up");
})

router.post('/sign-up',async (req, res)=>{
    try {
        // res.render("posts/sign-up")
        console.log("post reached")
        let flag = false;
        //  if(!req.body.firstName) {
        //     flag = true;
        //      throw 'Please provide Firstname';
            
        //  }
    
        //  if(!req.body.lastName) {
        //     flag = true;
        //      throw 'Please provide lastname';
            
        //  }
        //  if(!req.body.emailaddress){
        //     flag = true;
        //     throw 'Invalid Emailaddress';  
        //  }
    
        //  if(!req.body.selectUserType){
        //     flag = true; 
        //     throw 'Invalid type';
        //  }
        //  if(!req.body.password){ 
        //      flag = true 
        //      throw 'Enter password please';
        //  }
        //  if(!req.body.datecreated) {flag=true
        //      throw 'Enter a proper date';
        //  }
        //  if(!req.body.universityName){
        //      flag = true;
        //      throw 'Enter University name';
        //  }
         console.log("no error here")
         let user ={
            email:req.body.emailaddress,
            password:req.body.password,
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            universityName:req.body.universityName,
            userType:req.body.selectUserType,
            isActive,
            dateCreated:req.body.datecreated
         }
         
         const newUser = await users.createnewuser(user);
         if(newUser == null){
             flag = true
         
         }
         if(!newUser){
             flag = true;
         }
         res.status(200).json(newUser);
       
         
         
       } catch (e) {
         res.json({errors : "No inputs provided" , hasErrors:true});
         res.status(400);
       }
    });
    
    router.get('user/:id', async (req, res) => {
        try {
          let user = await users.getuserbyid(req.params.id);
          res.status(200).json(user);
        } catch (e) {
          res.status(404).json({ error: 'User not found' });
        }
      });

module.exports = router;