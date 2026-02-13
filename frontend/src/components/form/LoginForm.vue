<template>
    <div>
        <Message :msg="msg" :msgclass="msgClass"/>
        <form id="login-form" @submit="login($event)"></form>
        <div class="input-container">
            <label for="email">E-mail:</label>
            <input type="email" name="email" id="email" v-model="email" placeholder="Digite o seu e-mail">
        </div>
        <div class="input-container">
            <label for="password">Senha:</label>
            <input type="password" name="password" id="password" v-model="email" placeholder="Digite a sua senha">
        </div>
        <InputSubmit text="Entrar" />
    </div>
</template>

<script>
import Message from './Message.vue';
import InputSubmit from '@/components/form/InputSubmit.vue';

export default {
    name: "LoginForm",
    components: {
        Message,
        InputSubmit
    },
    data() {
        return {
            email: null,
            password: null,
            msg: null,
            msgClass: null
        }
    },
    methods: {
        async login(e){
            e.preventDefault();

            const data = {
                email: this.email,
                password: this.password
            };

            const jsonData = JSON.stringify(data);

            await fetch(`http://localhost:3000/api/auth/login`, {
                method: "POST",
                headers: {"Content type" : "application.json"},
                body: jsonData
            })
            .then((resp) => resp.json())
            .then((data) => {
                let auth = false;

                if(data.error) {
                    this.msg = data.error;
                    this.msgClass = "error";
                }else {
                    auth = true;
                    this.msg = data.msg;
                    this.msgClass = "success";

                    this.$store.commit("authenticate", {token: data.token, userId: data.userId})
                }

                setTimeout(() => {
                    if(!auth){
                        this.msg = null;
                    }else {
                        this.$router.push("dashboard");
                    }
                }, 2000);
            })
        }
    }
}
</script>

<style>
    #login-form {
        max-width: 400px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
    }
    .input-container {
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
        text-align: left;
    }

    .input-container label {
        margin-bottom: 10px;
        color: #555;
    }

    .input-container input {
        padding: 10px;
        border: 1px solid #e8e8e8;
    }
</style>
