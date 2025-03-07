const { Client } = require('basic-ftp');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Obtém o arquivo enviado
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao processar o arquivo' });
        }

        const file = files.file[0];
        const client = new Client();

        try {
          // Conectar ao FTP
          await client.access({
            host: 'www.palmasistemas.com.br/',
            user: 'palmasistemas',
            password: 'gremio1983',
            secure: false, // Ou true, dependendo do seu servidor FTP
          });
          
          // Enviar o arquivo para o servidor FTP
          await client.uploadFrom(file.filepath, 'www/Palma/' + file.originalFilename);
          client.close();
          
          return res.status(200).json({ status: 'Arquivo enviado com sucesso!' });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erro ao conectar com o FTP' });
        }
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro desconhecido' });
    }
  } else {
    return res.status(405).json({ error: 'Método não permitido' });
  }
}

