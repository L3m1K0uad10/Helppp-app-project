var tracker = 0;

function clickFaBarsIcon() {
    const asideContainer = document.getElementsByClassName("aside-nav-bar")[0];
    const mainBoxContainer = document.getElementsByClassName("main-box-container")[0];
    const userQuestionContainer = document.getElementsByClassName("user-display-question")[0];
    if (tracker === 0) {
        try {
            asideContainer.style.width = "20%";
            mainBoxContainer.style.width = "80%";
            userQuestionContainer.style.display = "flex";
            userQuestionContainer.style.flexDirection = "column";
            tracker = 1;
        } catch(error) {
            console.log(error.name)
            console.log(error.message)
        }
    } else {
        try {
            asideContainer.style.width = "5%";
            mainBoxContainer.style.width = "95%";
            userQuestionContainer.style.display = "none";
            tracker = 0;
        } catch(error) {
            console.log(error.name)
            console.log(error.message)
        }
    }
}      

export default clickFaBarsIcon