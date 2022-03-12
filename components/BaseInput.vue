<template>
  <div>
    <label :for="id" class="base-label">
      {{ label }}
    </label>
    <div
      :class="[
        'base-input-wrapper',
        { 'base-input-wrapper--focused': focused }
      ]"
    >
      <input
        :id="id"
        class="base-input"
        v-bind="$attrs"
        :placeholder="$attrs.placeholder"
        :value="modelValue"
        @focus="focusHandler"
        @input="inputHandler"
        @blur="blurHandler"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: ""
    },

    id: {
      type: String,
      default: ""
    },

    label: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      focused: false
    };
  },

  methods: {
    inputHandler(event) {
      this.$emit("update:modelValue", event.target.value);
    },

    focusHandler() {
      this.focused = true;
    },

    blurHandler() {
      this.focused = false;
    }
  }
};
</script>

<style scoped lang="scss">
.base-input-wrapper {
  border: 2px solid #a69ed6;
  border-radius: 4px;
  width: 100%;
  margin-top: 8px;

  &--focused {
    border-color: #7165be;
  }
}

.base-input {
  width: 100%;
  height: 30px;
  margin: 0;
  border: none;
  outline: none;
  padding: 3px 6px;
  background: transparent;

  &::placeholder {
    color: rgba(74, 85, 104, 1);
  }
}

.base-label {
  font-size: 18px;
  font-weight: 500;
  color: #352E5B;
}
</style>
