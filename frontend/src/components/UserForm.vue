<template>
    <div>
        <Message :msg="msg" :msgClass="msgClass" />
        <form id="user-form" @submit="page === 'register' ? register($event) : update($event) ">
            <div class="input-container">
                <label for="name">Nome:</label>
                <input type="text" id="name" name="name" v-model="name" placeholder="Digite o seu nome">
            </div>
            <div class="input-container">
                <label for="email">E-mail:</label>
                <input type="text" id="email" email="email" v-model="name" placeholder="Digite o seu email">
            </div>
            <div class="input-container">
                <label for="password">Senha:</label>
                <input type="password" id="password" email="password" v-model="name" placeholder="Digite a sua senha">
            </div>
            <div class="input-container">
                <label for="confirmpassword">Senha:</label>
                <input type="password" id="confirmpassword" email="confirmpassword" v-model="name" placeholder="Confirme a sua senha">
            </div>
            <InputSubmit :text="btnText"/>
        </form>
    </div>
</template>

<script>
import InputSubmit from '@/components/form/InputSubmit.vue';
import Message from './components/form/Message';

export default {
    name :"RegisterForm",
    data(){
        return{
            name: null,
            email: null,
            password: null,
            confirmpassword: null,
            btnText: "Cadastrar",
            msg: "Esta é a nossa mensagem",
            msgClass: null
        }
    },
    props: ["user", "page", "btnText"],
    components: {
        InputSubmit,
        Message
    },
    methods: {
        async register(e){
            e.preventDefault();

            const data = {
                name: this.name,
                email: this.email,
                password: this.password,
                confirmPassword: this.confirmPassword
            }

            const jsonData = JSON.stringify(data);

            await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                header: {"Content-type" : "application/json"},
                body: jsonData
            })
            .then((resp) => resp.json())
            .then((data) => {
                
                let auth = false

                if(data.error){
                    this.msg = data.error;
                    this.msgClass = "error";
                } else {
                    auth = true;
                    
                    this.msg = data.msg;
                    this.msgClass = "success"
                } 


                setTimeout(() => {
                    if(!auth){
                        this.msg = null;
                    }else {
                        this.$router.push("dashboard");
                    }
                }, 2000);

            })
            .catch((err) => {
                console.log(err)
            })
        }
    }
}
</script>

<style scoped>

    #user-form {
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