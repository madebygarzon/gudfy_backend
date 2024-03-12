import { EventBusService } from "@medusajs/medusa";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import { Email } from "../api/email/email-recovery-pasword";

type InjectedDependencies = {
  eventBusService: EventBusService;
};
interface DataOptions {
  email: string;
  token: string;
}

class RecoveryPasswork {
  constructor({ eventBusService }: InjectedDependencies) {
    eventBusService.subscribe(
      "customer.password_reset",
      this.handleRecoveryPass
    );
  }

  handleRecoveryPass = async (data: DataOptions) => {
    try {
      await sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
      const { email, token } = data;
      const emailHtml = render(
        <Email
          url={process.env.URL_RESET_PASSWORD}
          email={email}
          token={token}
        />
      );

      const options = {
        from: process.env.SENDGRID_FROM,
        to: email,
        subject: "Restablecimiento de Contraseña Solicitado - GUDFY",
        html: emailHtml,
      };

      sendgrid.send(options);
    } catch (error) {}
  };
}

export default RecoveryPasswork;
