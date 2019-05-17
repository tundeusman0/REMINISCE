const links = document.querySelector('.user_select').getElementsByTagName("p");
const showForm = document.querySelector('.show_form');
const checkLoan = document.querySelectorAll('.check_loan');
const loanRepay = document.querySelectorAll('.loanRepay');
const shows = document.querySelectorAll('.show');

for (let ind = 0; ind < shows.length; ind++) {
    links[ind].addEventListener('click', () => {
        if (shows[ind].style.display === "none") {
            shows.forEach(show => show.style.display = "none");
            shows[ind].style.display = "flex";
            showForm.style.display = "flex";
        } else if (shows[ind].style.display === "flex") {
            shows.forEach(show => show.style.display = "none");
            shows[ind].style.display = "none";
            showForm.style.display = "none";
        }else{
            shows.forEach(show => show.style.display = "none");
            shows[ind].style.display = "flex";
            showForm.style.display = "flex";
        }
    });

    
    if(ind < 2){
        
        checkLoan[ind].addEventListener('click', () => {
            if (loanRepay[ind].style.display === "none") {
                loanRepay.forEach(show => show.style.display = "none");
                loanRepay[ind].style.display = "block";
            } else if (loanRepay[ind].style.display === "block") {
                loanRepay.forEach(show => show.style.display = "none");
                loanRepay[ind].style.display = "none";
            } else {
                loanRepay.forEach(show => show.style.display = "none");
                loanRepay[ind].style.display = "block";
            }
        });
    }
        
}
