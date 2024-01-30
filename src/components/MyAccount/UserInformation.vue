<template>
    <div class="user-information-wrap">
        <h4 class="my-account-page-heading">User Information</h4>
        <form v-if="currentUser?.expand?.user_info">
            <div class="inputs-wrap">
                <div class="single-form-input">
                    <label for="first-name">First Name</label>
                    <input type="text" id="first-name" name="first-name" v-model="formData.first_name" />
                </div>
                <div class="single-form-input">
                    <label for="last-name">Last Name</label>
                    <input type="text" id="last-name" name="last-name" v-model="formData.last_name" />
                </div>

                <div class="single-form-input">
                    <label for="company-name">Company Name</label>
                    <input type="text" id="company-name" name="company-name" v-model="formData.company_name" />
                </div>
            </div>

            <div class="inputs-wrap">
                <div class="single-form-input">
                    <label for="country">Country</label>
                    <input type="text" id="country" name="country" v-model="formData.country" />
                </div>
                <div class="single-form-input">
                    <label for="city">City</label>
                    <input type="text" id="city" name="city" v-model="formData.city" />
                </div>
            </div>

            <div class="inputs-wrap">
                <div class="single-form-input">
                    <label for="street-address">Street Address</label>
                    <input type="text" id="street-address" name="street-address" v-model="formData.street_address" />
                </div>

                <div class="single-form-input">
                    <label for="zip">Zip Code</label>
                    <input type="text" id="zip" name="zip" v-model="formData.zip" />
                </div>
            </div>

            <div class="inputs-wrap">
                <div class="single-form-input">
                    <label for="phone">Phone</label>
                    <input type="text" id="phone" name="phone" v-model="formData.phone" />
                </div>
                <div class="single-form-input">
                    <label for="email">Email</label>
                    <input type="text" id="email" name="email" v-model="formData.email" />
                </div>
            </div>

            <button class="button-main">Save</button>
        </form>
        <LoadingOverlay v-else background="transparent" color="black" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import LoadingOverlay from '../Misc/LoadingOverlay.vue';

const props = defineProps({
    currentUser: { default: null },
});

const formData = ref(
    JSON.parse(
        JSON.stringify({
            first_name: props?.currentUser?.expand?.user_info.first_name,
            last_name: props?.currentUser?.expand?.user_info.last_name,
            company_name: props?.currentUser?.expand?.user_info.company_name,
            country: props?.currentUser?.expand?.user_info.country,
            street_address: props?.currentUser?.expand?.user_info.street_address,
            city: props?.currentUser?.expand?.user_info.city,
            zip: props?.currentUser?.expand?.user_info.zip,
            phone: props?.currentUser?.expand?.user_info.phone,
            email: props?.currentUser?.expand?.user_info.email,
        })
    )
);
</script>

<style scoped>
.my-account-page-heading {
    font-size: 20px;
    font-weight: 500;
}

form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    margin-top: 10px;
}

.inputs-wrap {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.single-form-input {
    display: flex;
    flex-direction: column;
    width: calc(50% - 10px);
}

.single-form-input input {
    padding: 10px;
    border: none;
    outline: none;
    background-color: rgba(0, 0, 0, 0.055);
    transition: 0.2s;
    border-radius: 3px;
    width: 100%;
}

.single-form-input input:focus-visible {
    background-color: rgba(255, 123, 0, 0.247);
}

.single-form-input label {
    display: inline-block;
    margin-bottom: 5px;
    font-weight: 500;
}
</style>
