"use strict";

const userForm = new UserForm();

const logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout((response) => {
        if (response.success) {
            location.reload();
        }
    });
};

ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoard = new RatesBoard();

const fetchCurrencyRates = () => {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
};

fetchCurrencyRates();
setInterval(fetchCurrencyRates, 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Баланс успешно пополнен.");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
};

moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Валюта успешно сконвертирована.");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
};

moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Деньги успешно переведены.");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
};

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((response) => {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        favoritesWidget.updateUsersList(response.data);
    }
});

favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success) {
            ApiConnector.getFavorites((response) => {
                if (response.success) {
                    favoritesWidget.clearTable();
                    favoritesWidget.fillTable(response.data);
                    favoritesWidget.updateUsersList(response.data);
                    favoritesWidget.setMessage(true, "Пользователь успешно добавлен в избранное.");
                }
            });
        } else {
            favoritesWidget.setMessage(false, response.error);
        }
    });
};

favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success) {
            ApiConnector.getFavorites((response) => {
                if (response.success) {
                    favoritesWidget.clearTable();
                    favoritesWidget.fillTable(response.data);
                    favoritesWidget.updateUsersList(response.data);
                    favoritesWidget.setMessage(true, "Пользователь успешно удален из избранного.");
                }
            });
        } else {
            favoritesWidget.setMessage(false, response.error);
        }
    });
};

userForm.loginFormCallback = (data) => {
    ApiConnector.login(data, (response) => {
        if (response.success) {
            location.reload();
        } else {
            userForm.setLoginErrorMessage(response.error);
        }
    });
};

userForm.registerFormCallback = (data) => {
    ApiConnector.register(data, (response) => {
        if (response.success) {
            location.reload();
        } else {
            userForm.setRegisterErrorMessage(response.error);
        }
    });
};