const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
})

const enviarMail = async (para, asunto, html) => {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        console.log(`Mail no configurado. No se mando "${asunto}" a ${para}`)
        return
    }
    try {
        await transporter.sendMail({
            from: `"Digital Night" <${process.env.MAIL_USER}>`,
            to: para,
            subject: asunto,
            html,
        })
    } catch (error) {
        console.log('No se pudo mandar el mail:', error.message)
    }
}

module.exports = enviarMail
