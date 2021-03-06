export default function SegueService ($state) {
    const states = $state.get();

    // TODO: add translation for it

    var modalContent = [
        [
            {
                title: "Uh oh",
                body: "It seems like you are missing parts of the kit. If that’s so, let’s notify the team and they’ll get back to you as soon as possible",
                image: "assets/images/alert.svg",
                button: "Notify the team!",
                action: "email"
            }
        ],
        [],
        []
    ];


    this.modalBox = function (type, lang) {
        var langValue = 0;
        if (lang == "esp") {
            langValue = 1;
            console.log("loading Spanish");
        } else if (lang == "cat") {
            langValue = 2;
            console.log("loading Catalan");
        } else {
            console.log("loading English");
        }
        return modalContent[langValue][type];
    };

    function getPageContent(val, index) {
        if (index == undefined) {
            index = 0;
        }
        var content = pageContent[index];
        for (var i = 0; i < content.length; i++) {
            if (content[i].index == val) {
                return (content[i]);
            }
        }
    }

    function getURLContent(url) {
        for (var i = 0; i < pageContent.length; i++) {
            if (pageContent[i].url == url) {
                return (pageContent[i]);
            }
        }
    }

    this.nextPage = function (accountPresent) {
        const currentState = $state.current;
        const indexState = states.indexOf(currentState);
        console.log(states, currentState, indexState);
        if (0 < indexState < states.length) {
          switch (currentState.name) {
            case 'wizard.wifi_check':
              $state.go('wizard.handshake');
              break;
            case 'wizard.confirm_handshake':
              $state.go('wizard.sensorName_prep');
              break;
            case 'wizard.account1':
              $state.go(accountPresent ? 'wizard.login' : 'wizard.account2');
              break;
            case 'wizard.login':
              $state.go('wizard.final');
              break;
            default:
              $state.go(states[indexState+1].name);
          }
        }
    };
    this.previousPage = function (accountPresent) {
        const currentState = $state.current;
        const indexState = states.indexOf(currentState);
        console.log(states, currentState, indexState);
        if (0 < indexState < states.length) {
          switch (currentState.name) {
            case 'wizard.accesspoint_pre':
              $state.go('wizard.wifi_check');
              break;
            case 'wizard.sensorName_prep':
              $state.go('wizard.confirm_handshake');
              break;
            case 'wizard.account2':
              $state.go('wizard.account1');
              break;
            case 'wizard.final':
              $state.go(accountPresent ? 'wizard.login' : 'wizard.account3');
              break;
            default:
              $state.go(states[indexState-1].name);
          }
        }
    };

    this.payloadGenerate = (content, index, part) => {

        // Ensure all the buttons copy is in lowercase to later postprocess in css at your taste
        // for (var key in content) {
        //     if (key.indexOf('Button') !== -1) {
        //         content[key] = content[key].toLowerCase();
        //     }
        // }

        var payload = content;

        // TODO: in wizardController on stateChange
        payload.progressLeftLabel = setupProgressLeft(index).toString() + " / 6";
        payload.progressRightLabel = setupProgressRight(index).toString() + " step #" + part;
        ///payload.progressVal = (index / pC.length) * 100;

        payload.companyLogo = content.companyLogo;
        payload.image = content.image;


        if ((index >= 1) && (index < 100)) {
            payload.backBlock = '';
        } else {
            payload.backBlock = 'hide';
        }
        if (index >= 1) {
            payload.forwardBlock = 'blocked';
        } else {
            payload.forwardBlock = 'hide';
        }

        return payload;
    }

    this.templateRowCounter = function (template) {

        // TODO --> put that info in the JSON
        var tuples;
        switch (template) { //constants for getting rows in templates
            case "basic1":
            case "pair1":
                tuples = 2;
                break;
            case "sensorName":
            case "final":
            case "make1":
            case "make2":
            case "wifi_check":
            case "landing":
            case "login":
                tuples = 4;
                break;
            default:
                tuples = 3;
        }
        return tuples; //change to array syntax
    };

    function setupProgressLeft(index) {
        if (index <= 3) {
            return 1;
        } else if (index <= 20) {
            return 2;
        } else if (index <= 34) {
            return 3;
        } else if (index <= 41) {
            return 4;
        } else if (index <= 53) {
            return 5;
        } else {
            return 6;
        }
    }

    function setupProgressRight(index) {
        if (index <= 3) {
            return "Introduction";
        } else if (index <= 20) {
            return "What's in the Box";
        } else if (index <= 33) {
            return "Handshake";
        } else if (index <= 41) {
            return "Naming";
        } else if (index <= 53) {
            return "Location";
        } else {
            return "Account";
        }
    }

}

SegueService.$inject = ['$state'];
