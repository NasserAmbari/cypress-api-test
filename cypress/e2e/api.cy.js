describe('API Tests for Reqres.in', () => {
    it('should retrieve a list of users', () => {
      cy.request('GET', '/users?page=2').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.an('array');
        expect(response.body.data.length).to.be.greaterThan(0);
      });
    });

    it('should retrieve a single users', () => {
        cy.request('GET', '/users/2').then((response) => {
          expect(response.status).to.eq(200);

          const userData = response.body.data;
          expect(userData).to.have.property('id', 2);
          expect(userData).to.have.property('email', 'janet.weaver@reqres.in');
          expect(userData).to.have.property('first_name', 'Janet');
          expect(userData).to.have.property('last_name', 'Weaver');
          expect(userData).to.have.property('avatar').and.include('https://reqres.in/img/faces/2-image.jpg');
        });
      });
  
    it('should single users not found', () => {
        cy.request({method: 'GET', url: '/users/23', failOnStatusCode: false}).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.be.empty;
        });
    });

    it('should retrieve a list of resources', () => {
        cy.request('GET', '/unknown').then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('data');
          expect(response.body.data).to.be.an('array');
          expect(response.body.data.length).to.be.greaterThan(0);
        });
    });

    it('should retrieve a single resources', () => {
        cy.request('GET', '/unknown/2').then((response) => {
          expect(response.status).to.eq(200);

          const resourceData = response.body.data;
          expect(resourceData).to.have.property('id', 2);
          expect(resourceData).to.have.property('name', 'fuchsia rose');
          expect(resourceData).to.have.property('year', 2001);
          expect(resourceData).to.have.property('color', '#C74375');
          expect(resourceData).to.have.property('pantone_value').and.include('17-2031');
        });
    });

    it('should single resource not found', () => {
        cy.request({method: 'GET', url: '/unknown/23', failOnStatusCode: false}).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.be.empty;
        });
    });

    it('should create a new user', () => {
      cy.request('POST', '/users', {
        name: 'Ahmad Nasser Ambari',
        job: 'Developer',
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('name', 'Ahmad Nasser Ambari');
        expect(response.body).to.have.property('job', 'Developer');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('createdAt');
      });
    });

    it('should update an existing user', () => {
      cy.request('PUT', '/users/2', {
        name: 'Ahmad Nasser Ambari',
        job: 'Senior Developer',
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('name', 'Ahmad Nasser Ambari');
        expect(response.body).to.have.property('job', 'Senior Developer');
        expect(response.body).to.have.property('updatedAt');
      });
    });

    it('should update a user\'s some data successfully', () => {
        cy.request({
          method: 'PATCH',
          url: '/users/2', 
          body: {
            name: 'Ahmad Nasser Ambari',
            job: 'Developer',
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('name', 'Ahmad Nasser Ambari');
          expect(response.body).to.have.property('job', 'Developer');
          expect(response.body).to.have.property('updatedAt');
        });
      });

    it('should delete a user', () => {
        cy.request('DELETE', '/users/2').then((response) => {
            expect(response.status).to.eq(204); 
            expect(response.body).to.be.empty;
        });
    });

    it('should successfully register a user', () => {
        cy.request({
            method: 'POST', 
            url: '/register',
            body: {
                "email": "eve.holt@reqres.in",
                "password": "pistol"
            }
        }).then((response) => {
            expect(response.status).to.eq(200); 
            expect(response.body).to.be.property('id', 4);
            expect(response.body).to.be.property('token', "QpwL5tke4Pnpja7X4");
        });
    });

    it('should unsuccessfully register a user', () => {
        cy.request({
            method: 'POST', 
            url: '/register',
            body: {
                "email": "sydney@fife",
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400); 
            expect(response.body).to.be.property('error', 'Missing password');
        });
    });

    it('should successfully login a user', () => {
        cy.request({
            method: 'POST', 
            url: '/login',
            body: {
                "email": "eve.holt@reqres.in",
                "password": "cityslicka"
            }
        }).then((response) => {
            expect(response.status).to.eq(200); 
            expect(response.body).to.be.property('token', 'QpwL5tke4Pnpja7X4');
        });
    });

    it('should unsuccessfully login a user', () => {
        cy.request({
            method: 'POST', 
            url: '/login',
            body: {
                "email": "peter@klaven",
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400); 
            expect(response.body).to.be.property('error', 'Missing password');
        });
    });
  
    it('should return 404 for non-existent resource', () => {
      cy.request({
        method: 'GET',
        url: '/unknown/23',
        failOnStatusCode: false, 
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.be.empty;
      });
    });
  });
  