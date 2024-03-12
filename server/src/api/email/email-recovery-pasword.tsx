import * as React from "react";



import {
  Container,
  Head,
  Text,
  Button,
  Html,
  Heading,
  Img,
  Tailwind,
  Section,
} from "@react-email/components";

interface EmailProps {
  url: string;
  email: string;
  token: string;
}

export function Email(props: EmailProps) {
  const { url, email, token } = props;

  return (
    <Html lang="en">
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                gf: "#1F0046",
              },
              boxShadow: {},
            },
          },
        }}
      >
        <Container>
          <div className="border-[1px] border-solid border-[#1F0046] rounded-md shadow">
            <div className="flex w-auto h-auto bg-gf text-[32px] justify-center rounded-t-md text-center text-white p-[5px] pl-3">
              <p>
                GUD<strong className="text-[#0BEBAA]">FY</strong>
              </p>
            </div>
            <div className="text-slate-800 px-5 py-2">
              <h1>Hola,</h1>
              <p>
                Estás recibiendo este correo porque has solicitado un
                restablecimiento de contraseña para tu cuenta en Gudfy.
              </p>
              <p>
                Para restablecer tu contraseña, por favor haz clic en el
                siguiente botón:
              </p>
              <Button
                href={`${url}/${token}/${email}`}
                className="bg-gf text-white py-2 px-2 rounded-md"
              >
                Restablecer Contraseña
              </Button>
              <p>
                Si no has solicitado un restablecimiento de contraseña, puedes
                ignorar este correo.
              </p>
              <p>Gracias,</p>
              <p>El equipo de Gudfy</p>
            </div>
          </div>
        </Container>
      </Tailwind>
    </Html>
  );
}
