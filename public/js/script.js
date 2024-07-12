const socket = io();
console.log("Hello from socket.io");

if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     const { latitude, longitude } = position.coords;
  //     socket.emit("sendLocation", { latitude, longitude });
  //   });
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

const markers = {};
socket.on("receive-location", (data) => {
  console.log(data);
  const { latitude, longitude, id } = data;
  map.setView([latitude, longitude], 25);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
