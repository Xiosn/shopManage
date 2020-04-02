<template>
    <div class="wrap">
        <div class="wrapFont">欢迎使用电商后台管理系统</div>
    </div>
</template>

<script>
export default {
    name: 'Welcome'
}
</script>

<style scoped>
.wrap{
        width: 600px;
        /* border: 1px solid red; */
        margin: 200px auto;
         /* background-color: yellow; */
         overflow: hidden;
    }
    .wrapFont{
        font-size: 50px;
        transform: translateX(0%);
        animation: scrols 7s infinite linear;
    }
    @keyframes scrols{
        from{
            transform: translateX(100%);
        }
        to{
            transform: translateX(-100%);
        }
    }
</style>