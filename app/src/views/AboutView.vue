<script setup>
import Card from '@/components/Card.vue'
import MD5 from 'crypto-js/md5'

function getGravatarProfilePic(email, size = 250) {
    let baseUrl = 'https://gravatar.com/avatar/'
    let emailHash = MD5(email)

    let url = baseUrl + emailHash + '?size=' + size
    return url
}
</script>
<template>
    <main style="margin-top: 3.5rem;">
        <card centered="true" style="text-align: center;">
            <img :src="getGravatarProfilePic('mma.ayoub@outlook.com', 250)" alt="" width="250" height="250">
            <h1>Moe Ayoub</h1>
            <h2>Full-Stack Developer</h2>
            <p style="text-align: left;">
                I graduated from South Dakota State University with a BSEE degree in 2020. 
                I have a strong background in electrical and electronics engineering, as well as object-oriented programming and web development. 
                I am passionate about creating innovative and user-friendly solutions that enhance the performance and efficiency of complex systems.
            </p>
        </card>
    </main>
</template>
<style lang="scss" scoped>
img {
    align-self: center;
    border: 5px solid rgba($color: #FFFFFF, $alpha: 0.2);
    backdrop-filter: blur(25px);
    border-radius: 100%;
    margin-top: -8rem;
}
</style>
