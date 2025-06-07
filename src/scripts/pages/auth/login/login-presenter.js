export default class LoginPresenter {
    #view;
    #model;
    #authModel;

    constructor({ view, model, authModel }) {
        this.#view = view;
        this.#model = model;
        this.#authModel = authModel;
    }

    async getLogin({ email, password }) {
        try {
            const response = await this.#model.getLogin({ email, password });

            if (!response.ok || !response.token || !response.user) {
                console.error('getLogin: Invalid response:', response);
                this.#view.loginFailed(response.message || 'Login failed: Invalid response');
                return;
            }

            // Simpan token
            this.#authModel.putAccessToken(response.token);

            // Panggil success handler
            this.#view.loginSuccessfully(response.message, {
                token: response.token,
                user: response.user,
            });

        } catch (error) {
            console.error('getLogin: error:', error);
            this.#view.loginFailed(error.message || 'Login failed due to network error');
        }
    }
}
