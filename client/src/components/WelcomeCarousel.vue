<template>
  <div id="carouselExampleDark" class="carousel carousel-dark slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
    </div>
    <div class="carousel-inner">
      <div class="carousel-item active" data-bs-interval="5000">
        <img src="../assets/images/introBackground2.jpg" class="d-block w-100" alt="...">
        <div class="carousel-caption position-absolute start-10 font-size-30">
          <h3 class="text-color1">Start Now With EasyCode</h3>
          <p class="text-color1 font-size-26">Start Learning any programming language or frameworke you want right now.</p>
          <router-link to="/user" >
            <button type="button" class="btn btn-outline-info font-size-22">Start Now</button>
          </router-link>
        </div>
      </div>
      <div class="carousel-item" data-bs-interval="5000">
        <img src="../assets/images/introBackground.jpg" class="d-block w-100" alt="...">
        <div class="carousel-caption position-absolute start-10 font-size-30">
          <h3 class="text-color1">CODING IS POER</h3>
          <p class="text-color1 font-size-22">Descover your skills and build your own projects</p>
          <router-link to="/user" >
            <button type="button" class="btn btn-outline-info font-size-22">Start Now</button>
          </router-link>
        </div>
      </div>
    </div>
    <button class="carousel-control-prev text-color1" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next text-color1" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>

  <div class="row m-4">
    <div class="col-md-6 gx-5 mb-4">
      <div class="bg-image hover-overlay ripple shadow-2-strong" data-mdb-ripple-color="light">
        <img src="../assets/images/man.jpg" class="img-fluid">
        <a href="#!">
          <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
        </a>
      </div>
    </div>

    <div class="col-md-6 gx-5 mb-4">
      <h4><strong>How You Can Join Us On Easy Code</strong></h4>
      <p class="text-muted">
        As a new user you have the ability sign up as a student nor as course supervisor, each of those functions required
        deferent data to be signed in.
      </p>
      <p><strong>Why EasyCode and not another website in the same major?</strong></p>
      <p class="text-muted">
        <p>1 - Easy Code give you the ability to choose your type and shows your profile to the public with a record of all things you done.</p>
        <p>2 - Easy Code has only one course from every major, this will enuring that you will not be lost inside deferent courses and not now which to choose.</p>
        <p>3 - Easy Code choose for you the best from the best.</p>
        <p>4 - Easy Code provide you with all those services for free.</p>
      </p>
      <p>
        <strong> Start Now For Free </strong>
        <router-link to="/user">
          <button class="btn btn-outline-warning" ><i class="fa-solid fa-user-plus"></i> Join </button>
        </router-link>
      </p>
    </div>
  </div>
  <hr class="my-5">
  <section class="text-center">
    <h4 class="mb-5"><strong>You Can Go To</strong></h4>
    <div class="row">
      <div class="col-lg-4 col-md-12 mb-4">
        <div class="card shadow-lg mb-5 bg-body rounded">
          <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
            <img src="https://mdbootstrap.com/img/new/standard/nature/184.jpg" class="img-fluid">
            <a href="#!">
              <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
            </a>
          </div>
          <div class="card-body">
            <h5 class="card-title">Projects</h5>
            <p class="card-text">
              Projects has been built by the students during their learning inside the EasyCode website.
            </p>
            <router-link to="/users" class="btn btn-outline-secondary"><i class="fa-solid fa-diagram-project"></i> Go To The Projects</router-link>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-12 mb-4">
        <div class="card shadow-lg mb-5 bg-body rounded">
          <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
            <img src="https://mdbootstrap.com/img/new/standard/nature/023.jpg" class="img-fluid">
            <a href="#!">
              <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
            </a>
          </div>
          <div class="card-body">
            <h5 class="card-title">Courses</h5>
            <p class="card-text">
              Go to courses and categories and pick one to start with step by step until you finish it and git the degree of that course.
            </p>
            <router-link to="/courses" class="btn btn-outline-secondary"><i class="fa-solid fa-video"></i> Go To The Courses</router-link>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-12 mb-4">
        <div class="card shadow-lg mb-5 bg-body rounded">
          <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
            <img src="https://mdbootstrap.com/img/new/standard/nature/111.jpg" class="img-fluid">
            <a href="#!">
              <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
            </a>
          </div>
          <div class="card-body">
            <h5 class="card-title">Sign up</h5>
            <p class="card-text">
              Sign up as a new student or supervisor to EasyCode website an have your own personal page and issuse.
            </p>
            <router-link to="/signup">
              <button type="button" class="btn btn-outline-secondary"><i class="fa-solid fa-user-plus"></i> Go To Sign Up</button>
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-12 mb-4">
        <div class="card shadow-lg mb-5 bg-body rounded">
          <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
            <img src="https://mdbootstrap.com/img/new/standard/nature/111.jpg" class="img-fluid">
            <a href="#!">
              <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
            </a>
          </div>
          <div class="card-body">
            <h5 class="card-title">Students</h5>
            <p class="card-text">
              Show, Filtter and search for any student in this page as well as open any student personal page to see more details about it.
            </p>
            <router-link to="/users" class="btn btn-outline-secondary"><i class="fa-solid fa-users"></i> Go To Show Students</router-link>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-12 mb-4">
        <div class="card shadow-lg mb-5 bg-body rounded">
          <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
            <img src="https://mdbootstrap.com/img/new/standard/nature/111.jpg" class="img-fluid">
            <a href="#!">
              <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
            </a>
          </div>
          <div class="card-body">
            <h5 class="card-title">Supervisors</h5>
            <p class="card-text">
              Show all supervisors and what courses did they teach,
              browsing their personal's pages to see more details.
            </p>
            <router-link to="/users" class="btn btn-outline-secondary"><i class="fa-solid fa-person-chalkboard"></i> Go To Show Supervisors</router-link>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-12 mb-4">
        <div class="card shadow-lg mb-5 bg-body rounded">
          <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
            <img src="https://mdbootstrap.com/img/new/standard/nature/111.jpg" class="img-fluid">
            <a href="#!">
              <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
            </a>
          </div>
          <div class="card-body">
            <h5 class="card-title">About</h5>
            <p class="card-text">
              Go to about page so you can read more and have clear and fulfill idea about the EasyCode website.
            </p>
            <router-link to="/about">
              <button type="button" class="btn btn-outline-secondary"><i class="fa-solid fa-circle-info"></i> Go To About EasyCode</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
    
</template>
