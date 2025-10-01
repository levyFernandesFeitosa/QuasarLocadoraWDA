// src/services/locatarioService.js
import { api } from 'boot/axios';

export function listarLocatarios() {
  return api.get('/renter');
}

export function criarLocatario(dados) {
  return api.post('/renter', dados);
}

export function atualizarLocatario(id, dados) {
  return api.put(`/renter/${id}`, dados);
}

export function deletarLocatario(id) {
  return api.delete(`/renter/${id}`);
}
