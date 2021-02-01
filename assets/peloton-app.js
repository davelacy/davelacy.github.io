const messagesTop = document.getElementById("messages-top");
const users = document.getElementById("presence");
const JsonMessagesTop = document.getElementById("json-messages-top");
const updateText = document.getElementById("update-text");
const sendButton = document.getElementById("publish-button");
const moodSelect = document.getElementById("mood-select");
const UUID = PubNub.generateUUID();

moodSelect.addEventListener("change", function () {
  if (this.value !== "none") {
    pubnub.setState({
      state: {
        mood: this.value,
        isExercising: true,
        currentMode: "Cycling",
        course: {
          map: "Marin Hwy 1",
          speed: 23,
        },
      },
      channels: ["Pubnub-demo"],
    });
  }
});

sendButton.addEventListener("click", () => {
  submitUpdate("Message", updateText.value);
});

// ===============================
// INITIALIZING PUBNUB SDK
// ===============================

const pubnub = new PubNub({
  // replace the following with your own publish and subscribe keys
  publish_key: "pub-c-0ccd4a24-d801-4b8d-8b3e-d4299e4260d2",
  subscribe_key: "sub-c-67e64c58-5fa2-11eb-aca9-6efe1c667573",
  ssl: true,
  uuid: UUID,
});

// ===============================
// ADD THE LISTENER
// ===============================

pubnub.addListener({
  message: (m) => {
    displayMessage(
      "MESSAGE",
      m.message.entry + ": " + m.message.update,
      "incoming message",
      m
    );
  },
  presence: (m) => {
    displayMessage("PRESENCE", "<b>UUID Joined:</b> " + m.uuid, m.action, m);
    if (m.occupancy > 1) {
      presence.textContent = m.occupancy + " people online";
    } else {
      presence.textContent = "Nobody else is online";
    }
  },
  status: (m) => {
    displayMessage(
      "STATUS",
      `<b>Channel</b>:${m.affectedChannels}`,
      m.category,
      m
    );

    if (m.category == "PNConnectedCategory") {
      submitUpdate(`<b class="text-info">Status:</b>`, "Connected");
    }
  },
});

// ===============================
// SUBSCRIBE TO THE PELOTON CHANNEL
// ===============================

pubnub.subscribe({
  channels: ["Pubnub-demo"],
  withPresence: true,
});

const submitUpdate = (anEntry, anUpdate) => {
  pubnub.publish(
    {
      channel: "Pubnub-demo",
      message: { entry: anEntry, update: anUpdate },
    },
    (status, r) => {
      if (status.error) {
        console.log(status);
      } else {
        displayMessage(
          "PUBLISH",
          `<b>Outgoing at</b>:${r.timetoken}`,
          "message sent",
          status
        );

        updateText.value = "";
      }
    }
  );
};

// ===============================
// EXTRA FUNCTION FOR CORRECTLY
// FORMATTING OUR MESSAGES
// ===============================

displayMessage = function (
  messageType,
  aMessage,
  messageTypeStatus = "",
  aMessageJSON = {}
) {
  let div = document.createElement("div");
  let thisIsYou = "";

  messagesTop.after(div);

  if (aMessageJSON) {
    if (aMessageJSON.uuid === UUID || aMessageJSON.publisher === UUID) {
      thisIsYou += `<b class="text-primary float-right">(This is you)</b>`;
    } else {
      thisIsYou += `<b class="text-secondary float-right">(This is NOT you)</b>`;
    }
  }

  div.innerHTML += `
  <div class="row">
    <div class="col-4">
        <div class="card bg-light mb-3" >
            <div class="card-header p-1"><b>[${messageType}]</b> ${messageTypeStatus} ${thisIsYou}</div>
            <div class="card-body p-1">
            <p class="card-text">${aMessage}</p>
            </div>
        </div>
    </div>
    <div class="col-8 p-0">
        <div class="card bg-light mb-3">
            <div class="card-header p-1">${messageType} Payload</div>
            <div class="card-body p-2">
            <pre><code class="hljs javascript">${JSON.stringify(
              aMessageJSON,
              null,
              4
            )}</code></pre>
            </div>
        </div>
    </div>
  </div>
    
    `;
};
