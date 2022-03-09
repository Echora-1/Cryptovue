<template>
  <button>
    <slot> </slot>
  </button>
</template>

<style lang="scss" scoped>
button {
  background-color: #7165be;
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  transition: background-color 0.5s;

  &:hover {
    background-color: #9381ff;
  }

  &:focus {
    outline: none;
  }
}
</style>
