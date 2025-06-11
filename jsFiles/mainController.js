app.controller("LandingController", [
  "$state",
  "api_request",
  function ($state, api_request) {
    var landingCtrl = this;

    landingCtrl.navigation = [
      {
        label: "Home",
        route: "landing",
        active: true,
        icon: "home",
      },
      {
        label: "Chat with PDF",
        route: "pdf",
        active: false,
        icon: "file-text",
      },
      {
        label: "Flashcards",
        route: "flash",
        active: false,
        icon: "layers",
      },
      {
        label: "Career Paths",
        route: "career",
        active: false,
        icon: "trending-up",
      },
    ];

    landingCtrl.footerData = [
      {
        type: "brand",
        title: "EDUEASE",
        // links: [
        //   { text: "Home", route: "landing", icon: "home" },
        //   { text: "About Us", url: "/about", icon: "info" },
        //   { text: "Contact", url: "/contact", icon: "mail" },
        //   { text: "Blog", url: "/blog", icon: "edit" },
        // ],
      },
      {
        title: "Features",
        type: "features",
        links: [
          { text: "Chat with PDF", route: "" },
          { text: "Smart Flashcards", route: "" },
          { text: "Interactive Quizes", route: "" },
        ],
      },
      {
        title: "Support",
        type: "support",
        links: [
          { text: "Help Center", url: "/" },
          { text: "FAQs", url: "/" },
          { text: "Privacy Policy", url: "/" },
          { text: "Terms of Service", url: "/" },
        ],
      },
    ];
  },
]);

app.controller("pdfController", [
  "api_request",
  "$http",
  function (api_request, $http) {
    var pdfCtrl = this;
    pdfCtrl.messages = [];

    pdfCtrl.downloadChat = function () {
      var chatContent = document.createElement("div");
      chatContent.style.padding = "20px";
      chatContent.style.fontFamily = "Arial, sans-serif";

      var title = document.createElement("h2");
      title.textContent = "Chat Conversation";
      title.style.textAlign = "center";
      title.style.color = "#333";
      title.style.marginBottom = "20px";
      chatContent.appendChild(title);

      var timestamp = document.createElement("p");
      timestamp.textContent = "Downloaded on: " + new Date().toLocaleString();
      timestamp.style.textAlign = "center";
      timestamp.style.color = "#666";
      timestamp.style.marginBottom = "30px";
      chatContent.appendChild(timestamp);

      pdfCtrl.messages.forEach(function (message) {
        var messageDiv = document.createElement("div");
        messageDiv.style.marginBottom = "15px";
        messageDiv.style.padding = "10px";
        messageDiv.style.borderRadius = "5px";
        messageDiv.style.maxWidth = "80%";

        if (message.type === "user") {
          messageDiv.style.marginLeft = "auto";
          messageDiv.style.backgroundColor = "#E3F2FD";
          messageDiv.innerHTML = "<strong>You:</strong> " + message.answer;
        } else {
          messageDiv.style.backgroundColor = "#F5F5F5";
          messageDiv.innerHTML =
            "<strong>Assistant:</strong> " + message.answer;
        }

        chatContent.appendChild(messageDiv);
      });

      var opt = {
        margin: [10, 10],
        filename: "chat-conversation.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };
      html2pdf().from(chatContent).set(opt).save();
    };

    pdfCtrl.fetchResponses = function () {
      api_request.post_withdata(
        "edu_ease/ask_question/",
        {
          question: pdfCtrl.question,
        },
        function (response) {
          console.log(response);
          pdfCtrl.messages.push({
            type: "user",
            answer: pdfCtrl.question,
          });
          pdfCtrl.messages.push({
            type: "assistant",
            answer: response.answer,
          });
          pdfCtrl.question = "";
        }
      );
    };

    pdfCtrl.file = function (element) {
      pdfCtrl.file = element.files[0];
    };

    pdfCtrl.files = function (element) {
      pdfCtrl.files = element.files[0];
    };

    pdfCtrl.uploadDocs = function () {
      var formData = new FormData();
      formData.append("files", pdfCtrl.file);
      formData.append("files", pdfCtrl.files);

      var req = {
        method: "POST",
        url: `${baseUrl}/edu_ease/upload_doc/`,
        headers: { "Content-Type": undefined },
        data: formData,
        withCredentials: true,
        transformRequest: angular.identity,
      };

      $http(req).then(
        function (response) {
          console.log(response);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: response.message,
          });
        },
        function (error) {
          console.log("error", error);
        }
      );
    };
  },
]);
