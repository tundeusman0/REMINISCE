const adminLoan = document.querySelectorAll('.admin_loan');
const admin_loanLick = document.querySelectorAll('.admin_loanLick');



for (let ind = 0; ind < adminLoan.length; ind++) {
    admin_loanLick[ind].addEventListener('click', () => {
            if (adminLoan[ind].style.display === "none") {
                adminLoan.forEach(show => show.style.display = "none");
                adminLoan[ind].style.display = "block";
            } else if (adminLoan[ind].style.display === "block") {
                adminLoan.forEach(show => show.style.display = "none");
                adminLoan[ind].style.display = "none";
            } else {
                adminLoan.forEach(show => show.style.display = "none");
                adminLoan[ind].style.display = "block";
            }
        });
}
