package com.spring.springboothotel.security.jwt;

import com.spring.springboothotel.security.userSecurity.HotelUserDetails;
import com.spring.springboothotel.security.userSecurity.HotelUserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private JwtUtils jwtUtils;
    private HotelUserService hotelUserService;
    private HandlerExceptionResolver handlerExceptionResolver;

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);


    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        try{
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateToken(jwt)){
                String email = jwtUtils.getUserNameFromToken(jwt);
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                if(email != null && authentication != null){
                    HotelUserDetails userDetails = (HotelUserDetails) hotelUserService.loadUserByUsername(email);

                    if(jwtUtils.isTokenValid(jwt, userDetails)){
                        UsernamePasswordAuthenticationToken authenticationToken =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails, null, userDetails.getAuthorities());

                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    }
                }
            }

            filterChain.doFilter(request,response);
        }catch (Exception e){
            logger.error("Cannot set user authentication : {} ", e.getMessage());
            handlerExceptionResolver.resolveException(request,response,null,e);
        }
    }

    private String parseJwt(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")){
            return authHeader.substring(7);
        }
        return null;
    }
}
