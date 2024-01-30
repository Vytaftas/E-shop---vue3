<template>
    <div class="about-us container">
        <div class="heading-wrap">
            <h3 class="heading">About Us</h3>
            <p class="heading-description">Lorem ipsum dolor sit amet.</p>
        </div>

        <div class="divider"></div>

        <div class="block-wrapper">
            <div class="about-block">
                <div class="image-block">
                    <img :src="aboutUs1" alt="About us 1" />
                </div>
                <div class="content-block">
                    <p class="content-heading">Lorem Ipsum Dolor</p>
                    <div class="content-text">
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac vestibulum dolor.</span>

                        <span
                            >Nulla eu vehicula turpis, ac eleifend mauris. Vivamus pulvinar urna ac metus feugiat eleifend. Duis a risus nec orci
                            venenatis vestibulum sed a massa. Praesent vitae metus gravida, pharetra metus sit amet, scelerisque enim. Nunc nec libero
                            risus. Mauris vel gravida dolor, sed viverra ex.</span
                        >

                        <span>
                            Maecenas varius nisl arcu, non tempor libero blandit fringilla. Ut nec nisi aliquet, semper massa sed, rhoncus odio.
                            Curabitur eu odio cursus, ultricies purus at, ullamcorper sapien. Aenean sed lorem eu orci faucibus malesuada at id magna.
                        </span>
                    </div>
                </div>
            </div>
            <div class="about-block reverse">
                <div class="image-block">
                    <img :src="aboutUs2" alt="About us 2" />
                </div>
                <div class="content-block">
                    <p class="content-heading">Lorem Ipsum Dolor</p>
                    <div class="content-text">
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac vestibulum dolor.</span>

                        <span
                            >Nulla eu vehicula turpis, ac eleifend mauris. Vivamus pulvinar urna ac metus feugiat eleifend. Duis a risus nec orci
                            venenatis vestibulum sed a massa. Praesent vitae metus gravida, pharetra metus sit amet, scelerisque enim. Nunc nec libero
                            risus. Mauris vel gravida dolor, sed viverra ex.</span
                        >

                        <span>
                            Maecenas varius nisl arcu, non tempor libero blandit fringilla. Ut nec nisi aliquet, semper massa sed, rhoncus odio.
                            Curabitur eu odio cursus, ultricies purus at, ullamcorper sapien. Aenean sed lorem eu orci faucibus malesuada at id magna.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import aboutUs1 from '../assets/about_us_1.jpg';
import aboutUs2 from '../assets/about_us_2.jpg';
</script>

<style scoped>
.heading-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.heading-wrap .heading {
    font-size: 40px;
    font-weight: 600;
}
.heading-wrap .heading-description {
}

.about-us {
    max-width: 1200px;
}

.block-wrapper {
    display: flex;
    flex-direction: column;
    gap: 50px;
}

.about-block {
    display: flex;
    align-items: center;
    box-shadow: 0 10px 20px 5px #00000012;
}

.about-block.reverse {
    flex-direction: row-reverse;
}

.image-block,
.content-block {
    width: 50%;
}

.image-block {
    display: flex;
}

.content-block {
    padding: 25px;
}

.content-block .content-heading {
    font-size: 28px;
    font-weight: 500;
    margin-bottom: 20px;
}

.content-block .content-text {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.content-block .content-text span {
    line-height: 1.5em;
    color: rgb(75, 75, 75);
}

.divider {
    height: 1px;
    max-width: 100px;
    background-color: rgb(255, 123, 0);
    margin: 25px auto;
    margin-bottom: 30px;
}
</style>
