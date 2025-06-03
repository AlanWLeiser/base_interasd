'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { criarFormulario } from '../../utils/formulario'
import { useAuth } from '../../hooks/useAuth'

export default function Formulario() {
    
    const router = useRouter()

    const [formData, setFormData] = useState({
        espiritual: {
            oracao: '',
            desafios: '',
            apoio: '3',
        },
        feedback: {
            notaCultos: '3',
            detalhes: '',
        },
        // outras categorias podem ser adicionadas aqui
    })

    function limparCamposVazios(lista) {
        return lista.filter((item) => item.resposta && item.resposta.trim() !== '')
    }

    async function handleSubmit() {
        const payload = {
            co_igreja: 1,
            usuario: {
                no_solicitante: user?.no_solicitante || 'Anônimo',
                no_email: user?.no_email || '',
                no_telefone: user?.no_telefone || '',
            },
            formularios: [
                {
                    categoria: 'Espiritual',
                    detalhes: limparCamposVazios([
                        {
                            co_tipo_pergunta: 'Pelo que posso orar por você?',
                            resposta: formData.espiritual.oracao,
                        },
                        {
                            co_tipo_pergunta: 'Desafios espirituais',
                            resposta: formData.espiritual.desafios,
                        },
                        {
                            co_tipo_pergunta: 'Apoio espiritual',
                            resposta: formData.espiritual.apoio,
                        },
                    ]),
                },
                {
                    categoria: 'Feedback',
                    detalhes: limparCamposVazios([
                        { co_tipo_pergunta: 'Nota cultos', resposta: formData.feedback.notaCultos },
                        {
                            co_tipo_pergunta: 'Detalhes feedback',
                            resposta: formData.feedback.detalhes,
                        },
                    ]),
                },
            ],
        }

        try {
            const res = await criarFormulario(payload, token)
            alert(res.mensagem)
            router.push('/minhas-interacoes')
        } catch (error) {
            alert('Erro ao enviar formulário.')
        }
    }

    return (
        <div>
            <h1>Formulário de Interação</h1>
            {/* seus alunos implementam os inputs com setFormData aqui */}
            <button onClick={handleSubmit}>Enviar</button>
        </div>
    )
}
