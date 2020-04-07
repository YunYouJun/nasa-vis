<template>
  <img class="my-5 logo" alt="Orbit Logo" src="/orbit.svg" />
</template>

<style>
.logo {
  color: white;
  height: 180px;
  width: 180px;
  transform: rotateY(560deg);
  animation: turn 3.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>
