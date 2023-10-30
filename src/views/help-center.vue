<template>
  <div class="help-center content-area">
    <div class="hour-email">
      <div>
        <div class="head">Horario de trabajo</div>
        <div class="item">De lunes a viernes (de 9.00 a 19.00 horas)</div>
      </div>
      <div>
        <div class="head">Correo electrónico</div>
        <div class="item">{{ feedEmail }}</div>
      </div>
    </div>

    <div class="questions">
      <div v-for="(item, index) in questions" :key="item.desc" class="item" @click="showAnswer(index)">
        <div class="desc">
          <span>{{ item.desc }}</span>
          <m-icon class="icon" :class="{ open: item.showAnswer }" type="right" :width="8" :height="12" />
        </div>
        <div class="answer" v-show="item.showAnswer" v-html="item.answer"></div>
      </div>
    </div>

    <!-- <div class="actions">
      <a @click="goComplain">I have a problem to complain</a>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      feedEmail: 'creditomax01@outlook.com',
      questions: [
        {
          desc: '¿Cómo puedo obtener un préstamo instantáneo?',
          answer: 'Todo lo que necesita es un teléfono Android, descargar CreditoMax de Google Play, preparar su C.C. ID y cuenta bancaria, y enviar su información de autenticación para una solicitud de préstamo.',
        },
        {
          desc: '¿Cuánto tardaré en recibir mi préstamo una vez aprobado?',
          answer: 'Por lo general, los fondos tardan de 1 a 2 días hábiles en llegar, pero puede tardar hasta el tercer día hábil debido a la lentitud de procesamiento de los bancos, así que por favor sea paciente. Por favor, espere pacientemente. El tiempo de liberación está sujeto al tiempo real de llegada.<br/>Recomendamos los siguientes cuatro bancos: Nequi, Bancolombia, Daviplata, que admiten préstamos en fin de semana y festivos y tienen un tiempo de llegada rápido.',
        },
        {
          desc: 'He realizado un pago pero mi pedido no se ha actualizado, ¿qué debo hacer?',
          answer: 'Lamentamos que esté experimentando este problema, por favor tenga paciencia ya que los pagos pueden tardar hasta 24 horas en llegar. Si el pedido no se ha actualizado en más de 24 horas, póngase en contacto con nuestro servicio de atención al cliente por correo electrónico.',
        },
        {
          desc: 'Quiero cambiar mi cuenta bancaria receptora, ¿qué debo hacer?',
          answer: 'Puede cambiar su cuenta bancaria en la página "Mi - Cuenta Bancaria" y luego volver a solicitar el préstamo.',
        },
        {
          desc: '¿Cómo puedo aumentar el importe de mi préstamo?',
          answer: 'Nuestro sistema evaluará el importe de su préstamo en función de su solvencia, por lo que le rogamos que efectúe sus pagos puntualmente y mantenga un buen historial crediticio, ya que ello contribuirá a aumentar el importe de su préstamo.',
        },
        {
          desc: '¿Por qué ha fallado mi solicitud de préstamo?',
          answer: 'Lamentablemente, puede deberse a varias razones y determinamos la elegibilidad de cada prestatario basándonos en la lógica y los algoritmos que hemos establecido. Si tu préstamo no se aprueba, significa que tu perfil no se ajusta al algoritmo y al modelo de riesgo crediticio que hemos establecido.',
        },
      ],
    };
  },
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Centro de ayuda',
    });
  },
  mounted() {
    this.setEventTrackStartTime();

    // setTimeout(async () => {
    //   try {
    //     let user = await this.getUserInfo();
    //     if (parseInt(user.id) % 2 == 1) {
    //       this.feedEmail = 'creditomax03@outlook.com';
    //     }
    //   } catch (error) {}
    // }, 200);
  },

  methods: {
    showAnswer(index) {
      this.$set(this.questions, index, { ...this.questions[index], showAnswer: !this.questions[index].showAnswer });
    },
    goComplain() {
      this.innerJump('complain-home');
    },
  },
};
</script>

<style lang="scss" scoped>
.help-center {
  padding-bottom: 24px;

  .actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    display: flex;
    justify-content: center;
    background: #fff;
    align-items: center;
    a {
      font-size: 14px;
      font-weight: 500;
      color: #1143a4;
      line-height: 18px;
      text-decoration: underline;
    }
  }

  .questions {
    background: #fff;
    padding: 16px 24px;
    .item {
      width: 320px;
      border-radius: 14px;
      box-sizing: border-box;
      font-size: 12px;
      margin-bottom: 20px;
      font-weight: 400;
      color: #999999;
      line-height: 16px;
      .desc {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        color: #000000;

        .icon {
          transition: all 0.3s;
          margin-top: 6px;
          &.open {
            transform: rotate(90deg);
          }
        }
      }
      .answer {
        padding-top: 10px;
      }
    }
  }

  .hour-email {
    background: #fff;
    padding: 16px;
    margin: 24px;
    border-radius: 8px;

    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      &:last-child {
        margin-bottom: 0;
      }
    }

    .head {
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
      flex-shrink: 0;
    }

    .item {
      flex-grow: 1;
      margin-left: 20px;
      height: 20px;
      box-sizing: border-box;
      border: none;
      font-size: 12px;
      font-weight: 900;
      width: 100%;
      color: #000000;
      text-align: right;
      line-height: 20px;
    }
  }
}
</style>
