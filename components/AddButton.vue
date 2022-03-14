<template>
  <button>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="#ffffff"
    >
      <path
        d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
      ></path>
    </svg>
    <span>Добавить</span>
  </button>
</template>

<style lang="scss" scoped>
button {
  background-color: #7165be;
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  transition: background-color 0.5s;
  display: inline-flex;
  align-items: center;

  @media (max-width: 640px) {
    padding: 8px 8px;
  }

  &:hover {
    background-color: #9381ff;
  }

  &:focus {
    outline: none;
  }

  span {
    @media (max-width: 640px) {
      display: none;
    }
  }

  svg {
    width: 1.5rem;
    margin-right: 0.5rem;
    height: 1.5rem;

    @media (max-width: 640px) {
      margin: 0;
    }
  }
}
</style>
