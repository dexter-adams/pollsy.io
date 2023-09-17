import React, { useContext, useEffect, useState } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';

interface PrivateRouteProps extends RouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({children, ...rest}) => {
    const {user, getAccessToken} = useContext(AuthContext);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = await getAccessToken();
            setAccessToken(token);
        };

        checkAuthentication();
    }, [getAccessToken]);

    return (
        <Route
            {...rest}
            render={({location}) =>
                user || accessToken ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: {from: location},
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;
